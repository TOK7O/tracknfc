export interface LinkLog {
    id: string;
    timestamp: string;
    hashed_ip: string;
    user_agent: string;
}

export interface AnalyticsData {
    recent: LinkLog[];
    total: number;
}

export interface CreateLinkPayload {
    slug: string;
    targetUrl: string;
}

export interface AuthState {
    isAuthenticated: boolean | null; // Null for loading/checking
    checkAuth: () => Promise<void>;
    login: (password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}