import { BarChart3 } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { Header } from './dashboard/Header';
import { Filters } from './dashboard/Filters';
import { StatsChart } from './dashboard/StatsChart';
import { LogsTable } from './dashboard/LogsTable';
import { StatsSummary } from './dashboard/StatsSummary';

interface DashboardProps {
    slug: string | null;
    onLinkUpdated: (newSlug: string) => void;
}

export function Dashboard({ slug, onLinkUpdated }: DashboardProps) {
    const {
        data,
        loading,
        range,
        setRange,
        uniqueOnly,
        setUniqueOnly,
        processedData,
        statsInView
    } = useAnalytics(slug);

    if (!slug) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                    <BarChart3 className="w-12 h-12 text-indigo-100" />
                </div>
                <p className="text-lg font-medium">Wybierz link z menu</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <Header
                slug={slug}
                total={data?.total || 0}
                loading={loading}
                onLinkUpdated={onLinkUpdated}
            />
            <Filters
                range={range}
                setRange={setRange}
                uniqueOnly={uniqueOnly}
                setUniqueOnly={setUniqueOnly}
            />
            <StatsSummary
                total={statsInView.total}
                unique={statsInView.unique}
                loading={loading}
                rangeLabel={range.toUpperCase()}
            />
            <StatsChart
                data={processedData}
                loading={loading}
                uniqueOnly={uniqueOnly}
            />
            <LogsTable
                data={data}
            />
        </div>
    );
}