import { Hono } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import { createMiddleware } from "hono/factory";

type Bindings = {
    LinkMap: KVNamespace;
    DB: D1Database;
    ASSETS: Fetcher;
    ADMIN_PASSWORD: string;
    JWT_SECRET: string;
    IP_SALT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const protectApi = createMiddleware(async (c, next) => {
    if (c.req.path.startsWith('/api/auth')) {
        await next();
        return;
    }
    const token = getCookie(c, 'auth_token');

    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
        await verify(token, c.env.JWT_SECRET);
        await next();
    } catch (e) {
        return c.json({ error: 'Invalid Token' }, 401);
    }
});

// Protect all API routes except auth
app.use('/api/*', protectApi)

// Log-in endpoint
app.post('/api/auth/login', async (c) => {
    const body = await c.req.json();

    // Password check
    if (body.password !== c.env.ADMIN_PASSWORD) {
        // If user fails to input the rights password - brute force protection
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000));
        return c.json({ error: 'Nieprawidłowe hasło' }, 401);
    }

    // Token that's valid for 24 hours
    const token = await sign({
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
    }, c.env.JWT_SECRET);

    // Safe http only cookie for authed users
    setCookie(c, 'auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 60 * 60 * 24,
    });

    return c.json({ success: true });
});

// Log-out endpoint
app.post('/api/auth/logout', (c) => {
    deleteCookie(c, 'auth_token');
    return c.json({ success: true });
});

// This endpoint checks if the user is logged in
app.get('/api/auth/me', async (c) => {
    const token = getCookie(c, 'auth_token');
    if (!token) return c.json({ loggedIn: false }, 401);

    try {
        await verify(token, c.env.JWT_SECRET);
        return c.json({ loggedIn: true });
    } catch {
        return c.json({ loggedIn: false }, 401);
    }
});

app.get('/api/links', async (c) => {
    const list = await c.env.LinkMap.list();
    return c.json(list.keys.map(key => key.name));
});

app.post('/api/links', async (c) => {
    const body = await c.req.json();
    const { slug, targetUrl } = body;

    if (!slug || !targetUrl) return c.json({ error: 'Błąd danych' }, 400);
    const slugRegex = /^[a-zA-Z0-9_-]+$/;

    //Check if slug has unallowed chars
    if (!slugRegex.test(slug)) {
        return c.json({ error: 'Slug może zawierać tylko litery, cyfry, myślniki i podkreślenia.' }, 400);
    }

    //Slugs reserved for admin purposes
    const reserved = ['api', 'auth', 'admin', 'login', 'logout', 'assets'];
    if (reserved.includes(slug.toLowerCase())) {
        return c.json({ error: 'Ten slug jest zarezerwowany dla systemu.' }, 400);
    }

    //Check if slug is already in use
    const existing = await c.env.LinkMap.get(slug);
    if (existing) {
        return c.json({ error: 'Ten slug jest już zajęty!' }, 409);
    }
    //Check if url is valid
    try {
        const urlObj = new URL(targetUrl);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return c.json({ error: 'Nieprawidłowy URL (musi zaczynać się od http:// lub https://)' }, 400);
        }
    } catch (e) {
        return c.json({ error: 'Nieprawidłowy format URL' }, 400);
    }

    await c.env.LinkMap.put(slug, targetUrl);
    return c.json({ success: true, slug, targetUrl }, 201);
});

app.get('/api/links/:slug', async (c) => {
    const slug = c.req.param('slug');
    const target = await c.env.LinkMap.get(slug);
    if (!target) return c.json({ error: 'Nie znaleziono linku' }, 404);
    return c.json({ target });
});

app.put('/api/links/:slug', async (c) => {
    const oldSlug = c.req.param('slug');
    const body = await c.req.json();
    const { newSlug, newTarget } = body;

    if (!newSlug || !newTarget) return c.json({ error: 'Brak danych' }, 400);

    //Check if slug has unallowed chars
    const slugRegex = /^[a-zA-Z0-9_-]+$/;
    if (!slugRegex.test(newSlug)) {
        return c.json({ error: 'Slug zawiera niedozwolone znaki' }, 400);
    }

    //Slugs reserved for admin purposes
    const reserved = ['api', 'auth', 'admin', 'login', 'logout', 'assets'];
    if (reserved.includes(newSlug.toLowerCase())) {
        return c.json({ error: 'Ta nazwa jest zarezerwowana dla systemu.' }, 400);
    }

    //Check if url is valid
    try {
        const urlObj = new URL(newTarget);
        if (!['http:', 'https:'].includes(urlObj.protocol)) throw new Error();
    } catch {
        return c.json({ error: 'Nieprawidłowy URL (musi być http:// lub https://)' }, 400);
    }

    if (oldSlug !== newSlug) {
        const existing = await c.env.LinkMap.get(newSlug);
        if (existing) {
            return c.json({ error: 'Ten slug jest już zajęty!' }, 409);
        }
    }

    await c.env.LinkMap.put(newSlug, newTarget);

    if (oldSlug !== newSlug) {
        await c.env.LinkMap.delete(oldSlug);
        await c.env.DB.prepare(
            'UPDATE Analytics SET link_slug = ? WHERE link_slug = ?'
        ).bind(newSlug, oldSlug).run();
    }

    return c.json({ success: true, newSlug, newTarget });
});
app.delete('/api/links/:slug', async (c) => {
    const slug = c.req.param('slug');
    const cleanup = c.req.query('cleanup') === 'true';
    await c.env.LinkMap.delete(slug);
    if (cleanup) {
        await c.env.DB.prepare(
            'DELETE FROM Analytics WHERE link_slug = ?'
        ).bind(slug).run();
    }

    return c.json({ success: true });
});

app.get('/api/analytics/:slug', async (c) => {
    const slug = c.req.param('slug');
    const range = c.req.query('range') || '7d';
    let startDate = new Date();
    switch (range) {
        case '24h': startDate.setHours(startDate.getHours() - 24); break;
        case '7d': startDate.setDate(startDate.getDate() - 7); break;
        case '30d': startDate.setDate(startDate.getDate() - 30); break;
        case '1y': startDate.setFullYear(startDate.getFullYear() - 1); break;
        case 'max': startDate = new Date(0); break;
        default: startDate.setDate(startDate.getDate() - 7);
    }

    const isoStartDate = startDate.toISOString();

    const { results } = await c.env.DB.prepare(
        `SELECT * FROM Analytics WHERE link_slug = ? AND timestamp >= ? ORDER BY timestamp ASC`
    ).bind(slug, isoStartDate).all();

    const countResult = await c.env.DB.prepare(
        `SELECT COUNT(*) as total FROM Analytics WHERE link_slug = ?`
    ).bind(slug).first();

    return c.json({
        recent: results,
        total: countResult?.total || 0
    });
});

app.get('/:slug{[a-zA-Z0-9_-]+}', async (c) => {
    const slug = c.req.param('slug');
    const targetUrl = await c.env.LinkMap.get(slug);

    if (!targetUrl) {
        return c.text('Szukany link nie został odnaleziony', 404);
    }

    c.executionCtx.waitUntil(logAnalytics(c.req.raw, c.env, slug));

    c.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    c.header('Expires', '-1');
    c.header('Pragma', 'no-cache');

    return c.redirect(targetUrl, 302);
});

app.get('*', async (c) => {
    return c.env.ASSETS.fetch(c.req.raw);
});

async function logAnalytics(request: Request, env: Bindings, slug: string) {
    try {
        const timestamp = new Date().toISOString();
        const userAgent = request.headers.get('User-Agent') || 'unknown';
        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const salt = env.IP_SALT || 'error-salt';
        const hashedIp = await hashString(ip, salt)
        await env.DB.prepare(
            'INSERT INTO Analytics (id, link_slug, timestamp, hashed_ip, user_agent) VALUES (?, ?, ?, ?, ?)',
        ).bind(crypto.randomUUID(), slug, timestamp, hashedIp, userAgent).run();
    } catch (e) { console.error('D1 Log Error:', e); }
}

async function hashString(input: string, salt: string = '') {
    const encoder = new TextEncoder();
    const data = encoder.encode(input + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default app;