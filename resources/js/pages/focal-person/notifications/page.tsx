//focal-person/notifications.tsx
import { useNotifications } from '@/hooks/use-notifications';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { NotificationItem, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BellRing,
    CheckCheck,
    Clock3,
    ExternalLink,
    Filter,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Notifications', href: '#' },
];

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

// Maps notification title keywords to a color theme
// Extend this as you add more notification types
function getNotificationTheme(title: string): {
    unreadBorder: string;
    unreadBg: string;
    badge: string;
    markReadBtn: string;
    viewBtn: string;
} {
    const t = title.toLowerCase();

    if (t.includes('approved') || t.includes('success')) {
        return {
            unreadBorder: 'border-emerald-200 dark:border-emerald-800',
            unreadBg: 'bg-emerald-50 dark:bg-emerald-950/30',
            badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
            markReadBtn:
                'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50',
            viewBtn: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white',
        };
    }
    if (t.includes('rejected') || t.includes('denied')) {
        return {
            unreadBorder: 'border-red-200 dark:border-red-800',
            unreadBg: 'bg-red-50 dark:bg-red-950/30',
            badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
            markReadBtn: 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50',
            viewBtn: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white',
        };
    }
    // default: indigo (submitted/pending/etc)
    return {
        unreadBorder: 'border-indigo-200 dark:border-indigo-800',
        unreadBg: 'bg-indigo-50 dark:bg-indigo-950/30',
        badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
        markReadBtn: 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950/50',
        viewBtn: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white',
    };
}

export default function NotificationsPage() {
    const { notifications } = usePage<{
        notifications: { data: NotificationItem[] };
    }>().props;

    const notificationList = notifications?.data ?? [];
    const { markAsRead, markAllAsRead, remove, removeAll } = useNotifications();

    const [filter, setFilter] = useState<NotificationFilter>('all');
    const [localReadMap, setLocalReadMap] = useState<Record<string, boolean>>(
        {},
    );

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

    // Click the card body → mark as read + navigate
    const handleCardClick = (item: NotificationItem & { isRead: boolean }) => {
        if (!item.isRead) {
            markNotificationAsRead(item.id);
        }
        if (item.action_url) {
            router.visit(item.action_url);
        }
    };

    // Click the "View" button → same behavior, but explicit
    const handleViewClick = (
        e: React.MouseEvent,
        item: NotificationItem & { isRead: boolean },
    ) => {
        e.stopPropagation(); // prevent card click from double-firing
        if (!item.isRead) {
            markNotificationAsRead(item.id);
        }
        if (item.action_url) {
            router.visit(item.action_url);
        }
    };

    const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // prevent card click
        markNotificationAsRead(id);
    };

    const handleRemove = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // prevent card click
        remove(id);
    };

    // Filter button styling helper
    const getFilterButtonStyle = (value: NotificationFilter) => {
        const baseClasses = "rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide capitalize transition-all duration-200";

        if (filter === value) {
            // Active filter - use distinct colors for each filter type
            switch(value) {
                case 'all':
                    return `${baseClasses} bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-primary/20`;
                case 'unread':
                    return `${baseClasses} bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-2 ring-blue-400/30 dark:bg-blue-500`;
                case 'read':
                    return `${baseClasses} bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/30 dark:bg-emerald-500`;
                default:
                    return `${baseClasses} bg-primary text-primary-foreground`;
            }
        } else {
            // Inactive filters
            switch(value) {
                case 'all':
                    return `${baseClasses} bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:ring-2 hover:ring-primary/30`;
                case 'unread':
                    return `${baseClasses} bg-muted/50 text-muted-foreground hover:bg-blue-50 hover:text-blue-600 hover:ring-2 hover:ring-blue-200 dark:hover:bg-blue-950/30 dark:hover:text-blue-400`;
                case 'read':
                    return `${baseClasses} bg-muted/50 text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600 hover:ring-2 hover:ring-emerald-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400`;
                default:
                    return `${baseClasses} bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary`;
            }
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header Card */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="flex items-center gap-2 text-xl font-semibold text-card-foreground">
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
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/20 hover:bg-primary/5 hover:text-primary hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    </div>

                    {/* Stats Cards - Improved colors */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 transition-colors hover:bg-muted/70">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Total
                            </p>
                            <p className="mt-1 text-lg font-semibold text-foreground">
                                {normalized.length}
                            </p>
                        </div>
                        <div className="rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:hover:bg-blue-950/60">
                            <p className="text-xs font-medium tracking-wide text-blue-600 dark:text-blue-400 uppercase">
                                Unread
                            </p>
                            <p className="mt-1 text-lg font-semibold text-blue-700 dark:text-blue-300">
                                {unreadCount}
                            </p>
                        </div>
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60">
                            <p className="text-xs font-medium tracking-wide text-emerald-600 dark:text-emerald-400 uppercase">
                                Read
                            </p>
                            <p className="mt-1 text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                                {readCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notifications List Card */}
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                            Filter by:
                        </p>
                        <div className="ml-2 flex flex-wrap gap-2">
                            {(['all', 'unread', 'read'] as const).map(
                                (value) => (
                                    <button
                                        key={value}
                                        onClick={() => setFilter(value)}
                                        className={getFilterButtonStyle(value)}
                                    >
                                        {value}
                                        {value === 'unread' && unreadCount > 0 && (
                                            <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Notification List */}
                    {filtered.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-12 text-center transition-colors hover:bg-muted/40">
                            <Bell className="mx-auto h-9 w-9 text-muted-foreground/70" />
                            <p className="mt-3 text-sm font-medium text-foreground">
                                No {filter !== 'all' ? filter : ''} notifications found
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {filter === 'unread'
                                    ? "You've caught up on all your notifications!"
                                    : filter === 'read'
                                    ? "You haven't marked any notifications as read yet"
                                    : "New updates will appear here once available."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((item) => {
                                const theme = getNotificationTheme(item.title);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => handleCardClick(item)}
                                        className={`group rounded-lg border px-4 py-3 transition-all duration-200 cursor-pointer ${
                                            item.isRead
                                                ? 'border-border bg-card hover:border-primary/20 hover:bg-primary/5 hover:shadow-sm'
                                                : `${theme.unreadBorder} ${theme.unreadBg} hover:shadow-md`
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-foreground">
                                                        {item.title}
                                                    </p>
                                                    {!item.isRead && (
                                                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${theme.badge}`}>
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {item.message}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                                                <Clock3 className="h-3.5 w-3.5" />
                                                {formatDateTime(item.created_at)}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2">
                                            {!item.isRead && (
                                                <button
                                                    onClick={(e) => handleMarkAsRead(e, item.id)}
                                                    className={`inline-flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${theme.markReadBtn}`}
                                                >
                                                    <CheckCheck className="h-3 w-3" />
                                                    Mark as read
                                                </button>
                                            )}
                                            {item.action_url && (
                                                <button
                                                    onClick={(e) => handleViewClick(e, item)}
                                                    className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-all hover:shadow-md ${theme.viewBtn}`}
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                    View
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleRemove(e, item.id)}
                                                className="ml-auto inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-950/50"
                                                title="Remove notification"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Clear all button - only show if there are notifications */}
                    {normalized.length > 0 && (
                        <div className="mt-4 flex justify-end border-t border-border pt-4">
                            <button
                                onClick={() => removeAll()}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-950/50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear all notifications
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
