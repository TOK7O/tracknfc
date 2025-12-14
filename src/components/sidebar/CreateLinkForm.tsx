import { Plus, Loader2 } from 'lucide-react';
import React from "react";

interface CreateFormProps {
    newSlug: string;
    setNewSlug: (val: string) => void;
    newTarget: string;
    setNewTarget: (val: string) => void;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export function CreateLinkForm({
                                   newSlug, setNewSlug, newTarget, setNewTarget, isSubmitting, onSubmit
                               }: CreateFormProps) {
    return (
        <div className="p-4 border-b border-gray-100">
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider ml-1">Nowy skrót</label>
                    <input
                        value={newSlug}
                        onChange={e => setNewSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                        placeholder="np. kowalski"
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                        required
                    />
                </div>
                <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider ml-1">Link docelowy</label>
                    <input
                        value={newTarget}
                        onChange={e => setNewTarget(e.target.value)}
                        placeholder="https://..."
                        type="url"
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                        required
                    />
                </div>
                <button disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-colors">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Plus className="w-4 h-4"/> Dodaj Link</>}
                </button>
            </form>
        </div>
    );
}