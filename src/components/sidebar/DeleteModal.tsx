import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    slug: string | null;
    onClose: () => void;
    onConfirm: (cleanup: boolean) => void;
    isDeleting: boolean;
}

export function DeleteModal({ isOpen, slug, onClose, onConfirm, isDeleting }: DeleteModalProps) {
    const [confirmation, setConfirmation] = useState('');
    const [cleanup, setCleanup] = useState(true);

    if (!isOpen || !slug) return null;

    const isMatch = confirmation === slug;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isMatch) {
            onConfirm(cleanup);
            setConfirmation('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="bg-red-50 p-6 border-b border-red-100 flex gap-4 items-start">
                    <div className="p-3 bg-white rounded-full shadow-sm text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-black text-red-900">Usuwanie linku</h3>
                        <p className="text-sm text-red-700 mt-1">
                            Zamierzasz usunąć link <span className="font-mono font-bold bg-white px-1 rounded">/{slug}</span>.
                            Tej operacji nie można cofnąć.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-red-400 hover:text-red-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                            type="checkbox"
                            checked={cleanup}
                            onChange={e => setCleanup(e.target.checked)}
                            className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        <div className="text-sm">
                            <span className="font-bold text-gray-800">Usuń też statystyki</span>
                            <p className="text-gray-500 text-xs mt-0.5">
                                Trwale usuwa wszystkie logi wejść powiązane z tym linkiem z bazy danych.
                            </p>
                        </div>
                    </label>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Aby potwierdzić, wpisz poniżej nazwę skrótu:
                        </label>
                        <input
                            value={confirmation}
                            onChange={e => setConfirmation(e.target.value)}
                            placeholder={slug}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-mono text-sm"
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Anuluj
                        </button>
                        <button
                            disabled={!isMatch || isDeleting}
                            className={`flex-1 px-4 py-2.5 text-white font-bold rounded-lg flex justify-center items-center gap-2 transition-all ${
                                isMatch
                                    ? 'bg-red-600 hover:bg-red-700 shadow-md shadow-red-200'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Trash2 className="w-4 h-4" /> Usuń trwale</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}