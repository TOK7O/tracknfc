import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Link as LinkIcon } from 'lucide-react';

interface EditLinkModalProps {
    isOpen: boolean;
    currentSlug: string;
    initialTargetUrl: string;
    onClose: () => void;
    onSave: (newSlug: string, newTarget: string) => Promise<void>;
}

export function EditLinkModal({ isOpen, currentSlug, initialTargetUrl, onClose, onSave }: EditLinkModalProps) {
    const [slug, setSlug] = useState(currentSlug);
    const [target, setTarget] = useState(initialTargetUrl);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSlug(currentSlug);
            setTarget(initialTargetUrl);
        }
    }, [isOpen, currentSlug, initialTargetUrl]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSave(slug, target);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-indigo-900">Edytuj Link</h3>
                    </div>
                    <button onClick={onClose} className="text-indigo-400 hover:text-indigo-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Skrót (Slug)</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 focus-within:ring-2 ring-indigo-500 transition-all">
                            <span className="text-gray-400 text-sm font-mono mr-1">/</span>
                            <input
                                value={slug}
                                onChange={e => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                                className="w-full py-2.5 text-sm outline-none font-medium text-slate-700"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Link Docelowy</label>
                        <input
                            value={target}
                            onChange={e => setTarget(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 ring-indigo-500 outline-none transition-all"
                            type="url"
                            required
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                            Anuluj
                        </button>
                        <button disabled={isSubmitting} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-200 flex justify-center items-center gap-2 transition-all">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Save className="w-4 h-4"/> Zapisz zmiany</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}