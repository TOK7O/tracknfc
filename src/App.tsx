import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

function AppContent() {
    const { isAuthenticated } = useAuth();
    const [links, setLinks] = useState<string[]>([]);
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
    const fetchLinks = () => {
        api.links.getAll().then(setLinks).catch(console.error);
    };

    useEffect(() => {
        if (isAuthenticated) fetchLinks();
    }, [isAuthenticated]);

    const handleOptimisticAdd = (newSlug: string) => {
        setLinks(prev => [...prev, newSlug].sort((a, b) => a.localeCompare(b)));
        setSelectedSlug(newSlug);
    };

    const handleOptimisticDelete = (slugToDelete: string) => {
        setLinks(prev => prev.filter(slug => slug !== slugToDelete));
        if (selectedSlug === slugToDelete) setSelectedSlug(null);
    };

    const handleLinkUpdated = (newSlug: string) => {
        setLinks(prev =>
            prev.map(s => s === selectedSlug ? newSlug : s)
                .sort((a, b) => a.localeCompare(b))
        );
        setSelectedSlug(newSlug);
    };


    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginScreen />;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans text-slate-800">
            <Sidebar
                links={links}
                selectedSlug={selectedSlug}
                onSelectSlug={setSelectedSlug}
                onRefresh={fetchLinks}
                onOptimisticAdd={handleOptimisticAdd}
                onOptimisticDelete={handleOptimisticDelete}
            />
            <main className="flex-1 bg-gray-50/50 p-8 overflow-y-auto h-screen">
                <Dashboard
                    slug={selectedSlug}
                    onLinkUpdated={handleLinkUpdated}
                />
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-center" richColors closeButton />
            <AppContent />
        </AuthProvider>
    );
}

export default App;