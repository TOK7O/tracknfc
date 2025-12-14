import { MousePointerClick, Users } from 'lucide-react';

interface StatsSummaryProps {
    total: number;
    unique: number;
    loading: boolean;
    rangeLabel: string;
}

export function StatsSummary({ total, unique, loading, rangeLabel }: StatsSummaryProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-colors">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Wszystkie wejścia
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-800">
                            {loading ? "..." : total}
                        </h3>
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {rangeLabel}
            </span>
                    </div>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                    <MousePointerClick className="w-6 h-6" />
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-teal-100 transition-colors">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Unikalni Użytkownicy
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-800">
                            {loading ? "..." : unique}
                        </h3>
                    </div>
                </div>
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                </div>
            </div>

        </div>
    );
}