import { Program } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, EllipsisVertical, Folder } from 'lucide-react';
import { useState } from 'react';

export default function GridView({ programs }: { programs: Program[] }) {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {programs.map((program) => (
                <div
                    key={program.id}
                    className="group relative rounded-xl border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
                >
                    <Link
                        // href={ViewController.reports(program)}
                        className="block"
                    >
                        {/* Header Section with Gradient Background */}
                        <div className="relative rounded-t-xl border-b border-border bg-gradient-to-br from-accent via-muted to-accent/50 p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/90 shadow-sm backdrop-blur-sm transition-transform group-hover:scale-105">
                                        <Folder className="h-6 w-6 text-primary-foreground" />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveMenu(
                                            activeMenu === program.id
                                                ? null
                                                : program.id,
                                        );
                                    }}
                                    className="rounded-lg p-1.5 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-background/50"
                                >
                                    <EllipsisVertical className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                                </button>
                            </div>

                            {/* Dropdown Menu */}
                            {activeMenu === program.id && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setActiveMenu(null)}
                                    />
                                    <div className="absolute top-14 right-4 z-20 w-48 rounded-lg border border-border bg-popover py-1 shadow-lg">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Open
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Share
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                                        >
                                            Rename
                                        </button>
                                        <div className="my-1 border-t border-border"></div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-destructive transition-colors hover:bg-accent"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4">
                            <h2 className="mb-2 truncate text-base font-semibold text-card-foreground transition-colors group-hover:text-foreground sm:text-lg">
                                {program.name}
                            </h2>
                            <p className="mb-4 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                                {program.description}
                            </p>

                            {/* Coordinator Info */}
                            <div className="mb-3 flex items-center gap-2.5 border-b border-border/50 pb-3">
                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-chart-1 to-chart-2 text-xs font-medium text-white shadow-sm">
                                    {getInitials(program.coordinator.name)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="block truncate text-xs text-muted-foreground">
                                        {program.coordinator.name}
                                    </span>
                                </div>
                            </div>

                            {/* Date Info */}
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">
                                    Modified {formatDate(program.updated_at)}
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
