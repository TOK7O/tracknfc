import { useState, useEffect, useMemo } from 'react';
import {
    format, parseISO, startOfHour, startOfDay, startOfMonth,
    eachHourOfInterval, eachDayOfInterval, eachMonthOfInterval,
    subHours, subDays, subYears
} from 'date-fns';
import type { AnalyticsData } from '../types';

export type TimeRange = '24h' | '7d' | '30d' | '1y';

export function useAnalytics(slug: string | null) {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [range, setRange] = useState<TimeRange>('7d');
    const [uniqueOnly, setUniqueOnly] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetch(`/api/analytics/${slug}?range=${range}`)
            .then(res => res.json())
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug, range]);
    const statsInView = useMemo(() => {
        if (!data?.recent) return { total: 0, unique: 0 };

        const logs = data.recent;
        const total = logs.length;
        const seen = new Map<string, number>();
        let uniqueCount = 0;
        const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        sortedLogs.forEach(log => {
            const logTime = new Date(log.timestamp).getTime();
            const lastSeen = seen.get(log.hashed_ip);
            if (!lastSeen || (logTime - lastSeen > 86400000)) {
                uniqueCount++;
                seen.set(log.hashed_ip, logTime);
            }
        });

        return { total, unique: uniqueCount };
    }, [data]);

    const processedData = useMemo(() => {
        if (!data?.recent) return [];

        const now = new Date();
        let intervalStart = now;
        let formatStr = 'HH:mm';
        let skeleton: Date[] = [];

        switch (range) {
            case '24h':
                intervalStart = subHours(now, 23);
                formatStr = 'HH:mm';
                skeleton = eachHourOfInterval({ start: intervalStart, end: now });
                break;
            case '7d':
                intervalStart = subDays(now, 7);
                formatStr = 'dd.MM';
                skeleton = eachDayOfInterval({ start: intervalStart, end: now });
                break;
            case '30d':
                intervalStart = subDays(now, 30);
                formatStr = 'dd.MM';
                skeleton = eachDayOfInterval({ start: intervalStart, end: now });
                break;
            case '1y':
                intervalStart = subYears(now, 1);
                formatStr = 'MMM yy';
                skeleton = eachMonthOfInterval({ start: intervalStart, end: now });
                break;
        }

        const groupedData = new Map<string, number>();
        skeleton.forEach(date => groupedData.set(format(date, formatStr), 0));

        let logs = [...data.recent];
        if (uniqueOnly) {
            const seen = new Map<string, number>();
            logs = logs.filter(log => {
                const logTime = new Date(log.timestamp).getTime();
                const lastSeen = seen.get(log.hashed_ip);
                if (!lastSeen || (logTime - lastSeen > 86400000)) {
                    seen.set(log.hashed_ip, logTime);
                    return true;
                }
                return false;
            });
        }

        logs.forEach(log => {
            const date = parseISO(log.timestamp);
            if (date < intervalStart) return;

            let key;
            if (range === '24h') key = format(startOfHour(date), formatStr);
            else if (range === '1y') key = format(startOfMonth(date), formatStr);
            else key = format(startOfDay(date), formatStr);

            if (groupedData.has(key)) {
                groupedData.set(key, (groupedData.get(key) || 0) + 1);
            }
        });

        return Array.from(groupedData.entries()).map(([date, count]) => ({ date, count }));
    }, [data, uniqueOnly, range]);

    return {
        data,
        loading,
        range,
        setRange,
        uniqueOnly,
        setUniqueOnly,
        processedData,
        statsInView
    };
}