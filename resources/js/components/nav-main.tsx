import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { SharedData, type NavBadgeVariant, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

// One place to control all badge colors
const BADGE_STYLES: Record<NavBadgeVariant, { dot: string; pill: string }> = {
    notification: {
        dot: 'bg-red-500',
        pill: 'bg-red-500 text-white',
    },
    warning: {
        dot: 'bg-amber-400',
        pill: 'bg-amber-400 text-amber-900',
    },
    info: {
        dot: 'bg-blue-500',
        pill: 'bg-blue-500 text-white',
    },
};

function formatCount(count: number, max = 99): string {
    return count > max ? `${max}+` : String(count);
}

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url, props } = usePage<SharedData>();
    const user = props.auth?.user;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // Resolve count from whichever key this item declared
                    const badgeCfg = item.badge;
                    const count =
                        badgeCfg && user
                            ? Number(user[badgeCfg.countKey] ?? 0)
                            : 0;
                    const variant = badgeCfg?.variant ?? 'notification';
                    const styles = BADGE_STYLES[variant];
                    const showBadge = count > 0;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={url.startsWith(resolveUrl(item.href))}
                                tooltip={{
                                    // Show count in tooltip when sidebar is collapsed
                                    children: showBadge
                                        ? `${item.title} (${formatCount(count)})`
                                        : item.title,
                                }}
                            >
                                <Link href={item.href}>
                                    {/* Icon + dot badge (visible in collapsed state) */}
                                    {item.icon && (
                                        <span className="relative shrink-0">
                                            <item.icon className="h-4 w-4" />
                                            {showBadge && (
                                                <span
                                                    className={`absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none font-bold text-white ring-2 ring-white ${styles.dot}`}
                                                >
                                                    {count > 9 ? '9+' : count}
                                                </span>
                                            )}
                                        </span>
                                    )}

                                    {/* Label + pill badge (visible in expanded state) */}
                                    <span className="flex flex-1 items-center justify-between">
                                        {item.title}
                                        {showBadge && (
                                            <span
                                                className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold ${styles.pill}`}
                                            >
                                                {formatCount(count)}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
