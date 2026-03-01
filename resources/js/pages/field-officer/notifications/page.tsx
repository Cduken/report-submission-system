import { useNotifications } from '@/hooks/use-notifications';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    CheckCheck,
    Clock3,
    ExternalLink,
    Filter,
    Loader2,
    Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Notifications', href: '#' },
];

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read_at: string | null;
    action_url: string | null;
}

interface NotificationPaginator {
    data: NotificationItem[];
    next_page_url: string | null;
    total: number;
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

function getNotificationTheme(title: string) {
    const t = title.toLowerCase();
    if (t.includes('approved') || t.includes('success')) {
        return {
            unreadBorder: 'border-emerald-200',
            unreadBg: 'bg-emerald-50',
            badge: 'bg-emerald-100 text-emerald-700',
            markReadBtn:
                'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
            viewBtn: 'bg-emerald-600 hover:bg-emerald-700',
        };
    }
    if (t.includes('rejected') || t.includes('denied')) {
        return {
            unreadBorder: 'border-red-200',
            unreadBg: 'bg-red-50',
            badge: 'bg-red-100 text-red-700',
            markReadBtn: 'border-red-200 text-red-600 hover:bg-red-50',
            viewBtn: 'bg-red-600 hover:bg-red-700',
        };
    }
    return {
        unreadBorder: 'border-indigo-100',
        unreadBg: 'bg-indigo-50',
        badge: 'bg-indigo-100 text-indigo-700',
        markReadBtn: 'border-indigo-200 text-indigo-600 hover:bg-indigo-50',
        viewBtn: 'bg-indigo-600 hover:bg-indigo-700',
    };
}

export default function NotificationsPage() {
    const { notifications } = usePage<{
        notifications: NotificationPaginator;
    }>().props;

    // Because Inertia::scroll() merges data on each page load,
    // `notifications.data` is always the full accumulated list.
    const notificationList = notifications?.data ?? [];
    const nextPageUrl = notifications?.next_page_url ?? null;

    const { markAsRead, markAllAsRead, remove } = useNotifications();
    const [filter, setFilter] = useState<NotificationFilter>('all');
    const [localReadMap, setLocalReadMap] = useState<Record<string, boolean>>(
        {},
    );
    const [loading, setLoading] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // ── Load next page ──────────────────────────────────────────────────────
    // Inertia::scroll() handles the merge; we just navigate to the next URL
    // with `preserveState + preserveScroll + only: ['notifications']`.
    const loadMore = useCallback(() => {
        if (!nextPageUrl || loading) return;
        setLoading(true);

        router.get(
            nextPageUrl,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['notifications'],
                onFinish: () => setLoading(false),
            },
        );
    }, [nextPageUrl, loading]);

    // ── IntersectionObserver sentinel ───────────────────────────────────────
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) loadMore();
            },
            { rootMargin: '200px' },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [loadMore]);

    // ── Derived state ───────────────────────────────────────────────────────
    const normalized = useMemo(
        () =>
            notificationList.map((item) => ({
                ...item,
                isRead: item.read_at !== null || localReadMap[item.id] === true,
            })),
        [notificationList, localReadMap],
    );

    const filtered = useMemo(() => {
        if (filter === 'unread') return normalized.filter((n) => !n.isRead);
        if (filter === 'read') return normalized.filter((n) => n.isRead);
        return normalized;
    }, [filter, normalized]);

    const unreadCount = normalized.filter((n) => !n.isRead).length;
    const readCount = normalized.length - unreadCount;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const markNotificationAsRead = (id: string) => {
        markAsRead(id);
        setLocalReadMap((prev) => ({ ...prev, [id]: true }));
    };

    const markAllNotificationsAsRead = () => {
        markAllAsRead();
        const next: Record<string, boolean> = {};
        normalized.forEach((n) => (next[n.id] = true));
        setLocalReadMap(next);
    };

    const handleCardClick = (item: NotificationItem & { isRead: boolean }) => {
        if (!item.isRead) markNotificationAsRead(item.id);
        if (item.action_url) router.visit(item.action_url);
    };

    const handleViewClick = (
        e: React.MouseEvent,
        item: NotificationItem & { isRead: boolean },
    ) => {
        e.stopPropagation();
        if (!item.isRead) markNotificationAsRead(item.id);
        if (item.action_url) router.visit(item.action_url);
    };

    const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        markNotificationAsRead(id);
    };

    const handleRemove = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        remove(id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* ── Header Card ─────────────────────────────────────────── */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                                <BellRing className="h-5 w-5 text-primary" />
                                Notifications
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Stay updated with submission activity and report
                                status changes.
                            </p>
                        </div>
                        <button
                            onClick={markAllNotificationsAsRead}
                            disabled={unreadCount === 0}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-accent hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Total
                            </p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {notifications.total}
                            </p>
                        </div>
                        <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                            <p className="text-xs font-medium tracking-wide text-primary uppercase">
                                Unread
                            </p>
                            <p className="mt-1 text-lg font-semibold text-primary">
                                {unreadCount}
                            </p>
                        </div>
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30">
                            <p className="text-xs font-medium tracking-wide text-emerald-600 uppercase dark:text-emerald-400">
                                Read
                            </p>
                            <p className="mt-1 text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                                {readCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── List Card ────────────────────────────────────────────── */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    {/* Filter row */}
                    <div className="mb-4 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                            Filter
                        </p>
                        <div className="ml-2 flex flex-wrap gap-2">
                            {(['all', 'unread', 'read'] as const).map(
                                (value) => (
                                    <button
                                        key={value}
                                        onClick={() => setFilter(value)}
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide capitalize transition-colors ${
                                            filter === value
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {value}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Notification list */}
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
                            {filtered.map((item) => {
                                const theme = getNotificationTheme(item.title);
                                const isClickable = !!item.action_url;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() =>
                                            isClickable && handleCardClick(item)
                                        }
                                        className={`group rounded-lg border px-4 py-3 transition-all ${
                                            item.isRead
                                                ? 'border-gray-200 bg-white'
                                                : `${theme.unreadBorder} ${theme.unreadBg}`
                                        } ${
                                            isClickable
                                                ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md'
                                                : 'cursor-default'
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {!item.isRead && (
                                                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                                                    )}
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.title}
                                                    </p>
                                                    {!item.isRead && (
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${theme.badge}`}
                                                        >
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {item.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Clock3 className="h-3.5 w-3.5" />
                                                    {formatDateTime(
                                                        item.created_at,
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) =>
                                                        handleRemove(e, item.id)
                                                    }
                                                    className="rounded p-1 text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 hover:text-red-400"
                                                    title="Dismiss notification"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {!item.isRead && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    onClick={(e) =>
                                                        handleMarkAsRead(
                                                            e,
                                                            item.id,
                                                        )
                                                    }
                                                    className={`inline-flex cursor-pointer items-center gap-1 rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium transition-colors ${theme.markReadBtn}`}
                                                >
                                                    <CheckCheck className="h-3.5 w-3.5" />
                                                    Mark as read
                                                </button>

                                                {item.action_url && (
                                                    <button
                                                        onClick={(e) =>
                                                            handleViewClick(
                                                                e,
                                                                item,
                                                            )
                                                        }
                                                        className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-colors ${theme.viewBtn}`}
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                        View Report
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {item.isRead && item.action_url && (
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 transition-colors group-hover:text-indigo-500">
                                                    <ExternalLink className="h-3 w-3" />
                                                    Click to view report
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Infinite scroll sentinel ──────────────────────────── */}
                    <div
                        ref={sentinelRef}
                        className="mt-4 flex justify-center py-2"
                    >
                        {loading && (
                            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading more…
                            </span>
                        )}
                        {!nextPageUrl &&
                            !loading &&
                            notificationList.length > 0 && (
                                <p className="text-xs text-muted-foreground/50">
                                    You've seen all notifications
                                </p>
                            )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
