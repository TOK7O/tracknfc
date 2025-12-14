import { BarChart3, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: { date: string; count: number }[];
    loading: boolean;
    uniqueOnly: boolean;
}

export function StatsChart({ data, loading, uniqueOnly }: ChartProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500"/>
                    {uniqueOnly ? 'Unikalni użytkownicy' : 'Wszystkie wejścia'}
                </h3>
            </div>

            {loading ? (
                <div className="h-full flex items-center justify-center text-gray-400"><Loader2
                    className="w-8 h-8 animate-spin text-indigo-200" /></div>
            ) : (
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" fontSize={11} axisLine={false} tickLine={false} stroke="#94a3b8" minTickGap={30} />
                        <YAxis allowDecimals={false} fontSize={11} axisLine={false} tickLine={false} stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)'}}
                            labelStyle={{color: '#64748b', marginBottom: '0.25rem', fontSize: '0.75rem'}} />
                        <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1}
                              fill="url(#colorCount)" activeDot={{r:6, fill:'#4f46e5', strokeWidth: 0}}
                              animationDuration={1000} />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}