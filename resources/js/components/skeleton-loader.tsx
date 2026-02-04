import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function ProgramGridSkeleton({
    count = 6,
    reviewOpen = true,
}: {
    count?: number;
    reviewOpen?: boolean;
}) {
    return (
        <div
            className={cn(
                'space-x-3 transition-all duration-300 ease-in-out',
                reviewOpen ? 'mr-[350px]' : 'mr-0',
            )}
        >
            {/* Title */}
            <div className="mb-3">
                <Skeleton className="h-5 w-32" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-start gap-5 rounded-sm border bg-background/50 px-4 py-2"
                    >
                        {/* Folder icon */}
                        <Skeleton className="h-6 w-6 rounded" />

                        {/* Content */}
                        <div className="flex w-full items-center justify-between">
                            {/* Program name */}
                            <Skeleton className="h-4 w-32" />

                            {/* Ellipsis */}
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
