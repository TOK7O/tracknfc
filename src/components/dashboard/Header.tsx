import { useState } from 'react';
import { ExternalLink, Copy, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { EditLinkModal } from './EditLinkModal';
import { api } from '../../services/api';

interface HeaderProps {
    slug: string;
    total: number;
    loading: boolean;
    onLinkUpdated: (newSlug: string) => void;
}

export function Header({ slug, total, loading, onLinkUpdated }: HeaderProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [targetUrl, setTargetUrl] = useState('');

    const copyToClipboard = () => {
        const url = `${window.location.origin}/${slug}`;
        navigator.clipboard.writeText(url).then(() => toast.success('Skopiowano!'));
    };

    const handleOpenEdit = async () => {
        try {
            const data = await api.links.getTarget(slug);
            setTargetUrl(data.target);
            setIsEditOpen(true);
        } catch {
            toast.error('Nie udało się pobrać szczegółów linku');
        }
    };

    const handleSave = async (newSlug: string, newTarget: string) => {
        try {
            await api.links.update(slug, newSlug, newTarget);
            toast.success('Link zaktualizowany!');
            setIsEditOpen(false);

            if (newSlug !== slug) {
                onLinkUpdated(newSlug);
            }
        } catch (e: any) {
            toast.error(e.message || 'Błąd aktualizacji');
        }
    };

    return (
        <>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Aktywny</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">/{slug}</h1>
                    <a href={`${window.location.origin}/${slug}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 mt-2 transition-colors">
                        {window.location.origin}/{slug} <ExternalLink className="w-3 h-3"/>
                    </a>
                </div>
                <div className="flex items-center bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Całkowite wejścia</p>
                        <p className="text-4xl font-black text-indigo-600">{loading ? "..." : total}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200 mx-6 hidden md:block"></div>

                    <div className="flex gap-2">
                        <button onClick={handleOpenEdit} className="p-3 hover:bg-white rounded-xl text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-gray-200" title="Edytuj">
                            <Settings className="w-6 h-6" />
                        </button>
                        <button onClick={copyToClipboard} className="p-3 hover:bg-white rounded-xl text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-gray-200" title="Kopiuj">
                            <Copy className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <EditLinkModal
                isOpen={isEditOpen}
                currentSlug={slug}
                initialTargetUrl={targetUrl}
                onClose={() => setIsEditOpen(false)}
                onSave={handleSave}
            />
        </>
    );
}