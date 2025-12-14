import { Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { AnalyticsData } from '../../types';

export function LogsTable({ data }: { data: AnalyticsData | null }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 text-sm flex gap-2 items-center"><Users className="w-4 h-4 text-gray-400"/> Ostatnie logi</h3>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-sm text-left relative">
                    <thead className="bg-white text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-8 py-3 font-bold bg-gray-50">Data</th>
                        <th className="px-8 py-3 font-bold bg-gray-50">IP (Hash)</th>
                        <th className="px-8 py-3 font-bold bg-gray-50">User Agent</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {data?.recent?.length === 0 ? (
                        <tr><td colSpan={3} className="px-8 py-8 text-center text-gray-400">Brak danych w wybranym okresie</td></tr>
                    ) : (
                        data?.recent?.slice().reverse().map((e) => (
                            <tr key={e.id} className="hover:bg-indigo-50/30 transition-colors">
                                <td className="px-8 py-3 font-mono text-xs text-indigo-600 whitespace-nowrap">{format(parseISO(e.timestamp), 'yyyy-MM-dd HH:mm:ss')}</td>
                                <td className="px-8 py-3 font-mono text-xs text-gray-500">{e.hashed_ip.substring(0, 12)}...</td>
                                <td className="px-8 py-3 text-xs text-gray-600 truncate max-w-xs" title={e.user_agent}>{e.user_agent}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}