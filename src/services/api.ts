import type {AnalyticsData, CreateLinkPayload} from "../types";

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        if (res.status === 401) {
            throw new Error('Unauthorized');
        }
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Wystąpił błąd');
    }
    return res.json();
}

export const api = {
    auth: {
        login: async (password: string) => {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                body: JSON.stringify({ password }),
                headers: { 'Content-Type': 'application/json' }
            });
            return handleResponse<{ success: true }>(res);
        },
        logout: async () => {
            await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
        },
        me: async () => {
            const res = await fetch(`${API_BASE}/auth/me`);
            if (!res.ok) throw new Error('Not logged in');
            return res.json();
        }
    },
    links: {
        getAll: async () => {
            const res = await fetch(`${API_BASE}/links`);
            return handleResponse<string[]>(res);
        },
        create: async (payload: CreateLinkPayload) => {
            const res = await fetch(`${API_BASE}/links`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });
            return handleResponse<{ success: true }>(res);
        },
        delete: async (slug: string, cleanup: boolean) => {
            const res = await fetch(`${API_BASE}/links/${slug}?cleanup=${cleanup}`, {
                method: 'DELETE'
            });
            return handleResponse<{ success: true }>(res);
        },
        getTarget: async (slug: string) => {
            const res = await fetch(`${API_BASE}/links/${slug}`);
            return handleResponse<{ target: string }>(res);
        },

        update: async (oldSlug: string, newSlug: string, newTarget: string) => {
            const res = await fetch(`${API_BASE}/links/${oldSlug}`, {
                method: 'PUT',
                body: JSON.stringify({ newSlug, newTarget }),
                headers: { 'Content-Type': 'application/json' }
            });
            return handleResponse<{ success: true }>(res);
        },
        getAnalytics: async (slug: string) => {
            const res = await fetch(`${API_BASE}/analytics/${slug}`);
            return handleResponse<AnalyticsData>(res);
        }
    }
};