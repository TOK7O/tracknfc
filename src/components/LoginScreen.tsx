import React, { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function LoginScreen() {
    const { login } = useAuth();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const success = await login(password);
        if (!success) {
            toast.error('Nieprawidłowe hasło');
        } else {
            toast.success('Zalogowano pomyślnie');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="flex justify-center mb-6 text-indigo-600">
                    <div className="p-4 bg-indigo-50 rounded-full">
                        <Lock className="w-8 h-8" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-center text-slate-800 mb-2">Panel Admina</h2>
                <p className="text-center text-gray-500 mb-8 text-sm">TrackNFC Management System</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Hasło administratora..."
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        autoFocus
                    />
                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5"/> : "Zaloguj się"}
                    </button>
                </form>
            </div>
        </div>
    );
}