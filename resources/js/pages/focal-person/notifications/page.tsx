import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Bell, BellRing, CheckCheck, Clock3, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: ViewController.notifications().url,
    },
];

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read_at: string | null;
    type?: string;
}

type NotificationFilter = 'all' | 'unread' | 'read';

function formatDateTime(value: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

export default function NotificationsPage() {
    const { notifications = [] } = usePage<{
        notifications?: NotificationItem[];
    }>().props;

    const [filter, setFilter] = useState<NotificationFilter>('all');
    const [localReadMap, setLocalReadMap] = useState<Record<string, boolean>>(
        {},
    );

    const normalized = useMemo(
        () =>
            notifications.map((item) => ({
                ...item,
                isRead: item.read_at !== null || localReadMap[item.id] === true,
            })),
        [notifications, localReadMap],
    );

    const filtered = useMemo(() => {
        if (filter === 'unread')
            return normalized.filter((item) => !item.isRead);
        if (filter === 'read') return normalized.filter((item) => item.isRead);
        return normalized;
    }, [filter, normalized]);

    const unreadCount = normalized.filter((item) => !item.isRead).length;
    const readCount = normalized.length - unreadCount;

    const markAsRead = (id: string) => {
        setLocalReadMap((prev) => ({ ...prev, [id]: true }));
    };

    const markAllAsRead = () => {
        const next: Record<string, boolean> = {};
        normalized.forEach((item) => {
            next[item.id] = true;
        });
        setLocalReadMap(next);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <BellRing className="h-5 w-5 text-indigo-500" />
                                Notifications
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Stay updated with submission activity and report
                                status changes.
                            </p>
                        </div>
                        <button
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                            <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                                Total
                            </p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">
                                {normalized.length}
                            </p>
                        </div>
                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                            <p className="text-xs font-medium tracking-wide text-blue-600 uppercase">
                                Unread
                            </p>
                            <p className="mt-1 text-lg font-semibold text-blue-700">
                                {unreadCount}
                            </p>
                        </div>
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                            <p className="text-xs font-medium tracking-wide text-emerald-600 uppercase">
                                Read
                            </p>
                            <p className="mt-1 text-lg font-semibold text-emerald-700">
                                {readCount}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <p className="text-sm font-medium text-gray-700">
                            Filter
                        </p>
                        <div className="ml-2 flex flex-wrap gap-2">
                            {(['all', 'unread', 'read'] as const).map(
                                (value) => {
                                    const active = filter === value;
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => setFilter(value)}
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide capitalize transition-colors ${
                                                active
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-gray-200 px-4 py-12 text-center">
                            <Bell className="mx-auto h-9 w-9 text-gray-300" />
                            <p className="mt-3 text-sm font-medium text-gray-700">
                                No notifications found
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                New updates will appear here once available.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((item) => (
                                <div
                                    key={item.id}
                                    className={`rounded-lg border px-4 py-3 transition-colors ${
                                        item.isRead
                                            ? 'border-gray-200 bg-white'
                                            : 'border-indigo-100 bg-indigo-50'
                                    }`}
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {item.title}
                                                </p>
                                                {!item.isRead && (
                                                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-700 uppercase">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {item.message}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            {formatDateTime(item.created_at)}
                                        </div>
                                    </div>

                                    {!item.isRead && (
                                        <div className="mt-3">
                                            <button
                                                onClick={() =>
                                                    markAsRead(item.id)
                                                }
                                                className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-indigo-200 bg-white px-2.5 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                                            >
                                                Mark as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
