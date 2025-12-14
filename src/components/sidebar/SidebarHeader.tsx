import { QrCode, LogOut } from 'lucide-react';

export function SidebarHeader({ onLogout }: { onLogout: () => void }) {
    return (
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                <QrCode className="w-6 h-6" /> TrackNFC
            </div>
            <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Wyloguj"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
    );
}