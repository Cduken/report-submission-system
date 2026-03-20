import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function ProgramGridSkeleton({
    count = 6,
    isList = false,
    reviewOpen = true,
}: {
    count?: number;
    isList?: boolean;
    reviewOpen?: boolean;
}) {
    return (
        <div
            className={cn(
                'p-4 transition-all duration-300 ease-in-out',
                reviewOpen ? 'sm:mr-[350px]' : 'mr-0',
            )}
        >
            {isList ? (
                /* ── List skeleton ── */
                <div className="flex flex-col overflow-hidden rounded-xl border dark:border-gray-700">
                    {/* Header */}
                    <div className="hidden grid-cols-12 gap-4 border-b bg-muted/40 px-4 py-2 sm:grid dark:border-gray-700 dark:bg-gray-800/50">
                        <Skeleton className="col-span-5 h-3 w-16" />
                        <Skeleton className="col-span-4 h-3 w-20" />
                        <Skeleton className="col-span-2 h-3 w-20" />
                    </div>

                    {Array.from({ length: count }).map((_, index) => (
                        <div
                            key={index}
                            className="border-b px-4 py-3 last:border-b-0 dark:border-gray-700"
                        >
                            {/* Mobile */}
                            <div className="flex items-center gap-3 sm:hidden">
                                <Skeleton className="h-8 w-8 rounded-lg" />
                                <div className="flex-1 space-y-1.5">
                                    <Skeleton className="h-3.5 w-36" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-6 w-6 rounded-md" />
                            </div>

                            {/* Desktop */}
                            <div className="hidden grid-cols-12 items-center gap-4 sm:grid">
                                <div className="col-span-5 flex items-center gap-2">
                                    <Skeleton className="h-7 w-7 rounded-md" />
                                    <Skeleton className="h-3.5 w-36" />
                                </div>
                                <div className="col-span-4 flex items-center gap-2">
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <div className="col-span-2">
                                    <Skeleton className="h-3 w-28" />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <Skeleton className="h-6 w-6 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* ── Grid skeleton ── */
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: count }).map((_, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-3 rounded-xl border bg-card p-4 dark:border-gray-700 dark:bg-gray-900/50"
                        >
                            {/* Icon + name + ellipsis */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <Skeleton className="h-9 w-9 rounded-lg" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-3.5 w-36" />
                                        <Skeleton className="h-3 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <Skeleton className="h-7 w-7 rounded-md" />
                            </div>

                            {/* Coordinator footer */}
                            <div className="flex items-center gap-2 border-t pt-2 dark:border-gray-700">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
