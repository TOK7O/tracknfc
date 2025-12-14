import { Filter } from 'lucide-react';
import type { TimeRange } from '../../hooks/useAnalytics';

interface FiltersProps {
    range: TimeRange;
    setRange: (r: TimeRange) => void;
    uniqueOnly: boolean;
    setUniqueOnly: (u: boolean) => void;
}

export function Filters({ range, setRange, uniqueOnly, setUniqueOnly }: FiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                {(['24h', '7d', '30d', '1y'] as const).map((r) => (
                    <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                            range === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {r.toUpperCase()}
                    </button>
                ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none group px-4">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${uniqueOnly ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                    {uniqueOnly && <Filter className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={uniqueOnly} onChange={e => setUniqueOnly(e.target.checked)} />
                <span className={`text-sm font-medium ${uniqueOnly ? 'text-indigo-700' : 'text-gray-500 group-hover:text-gray-700'}`}>Unikalne (24h)</span>
            </label>
        </div>
    );
}