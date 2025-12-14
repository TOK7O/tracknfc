import { LayoutDashboard, Trash2 } from 'lucide-react';

interface LinkListProps {
    links: string[];
    selectedSlug: string | null;
    onSelect: (slug: string) => void;
    onDelete: (slug: string) => void;
}

export function LinkList({ links, selectedSlug, onSelect, onDelete }: LinkListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-3">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-2">
                Twoje Linki ({links.length})
            </h3>
            <ul className="space-y-1">
                {links.map(slug => (
                    <li key={slug}
                        onClick={() => onSelect(slug)}
                        className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all border ${
                            selectedSlug === slug
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                                : 'border-transparent hover:bg-gray-50 text-gray-600'
                        }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <LayoutDashboard className={`w-4 h-4 shrink-0 ${selectedSlug === slug ? 'opacity-100' : 'opacity-50'}`}/>
                            <span className="truncate text-sm font-medium">/{slug}</span>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(slug); }}
                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-all"
                            title="Usuń"
                        >
                            <Trash2 className="w-4 h-4"/>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}