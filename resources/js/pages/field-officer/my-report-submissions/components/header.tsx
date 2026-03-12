// components/header.tsx (Simple & Elegant)
import { FilterType } from '@/types';
import { router } from '@inertiajs/react';
import { FileCheck } from 'lucide-react';

interface HeaderProps {
    activeFilter?: FilterType;
}

export default function Header({ activeFilter = 'all' }: HeaderProps) {
    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'rejected', label: 'Rejected' },
        { key: 'accepted', label: 'Accepted' },
    ];

    const handleFilterClick = (filter: FilterType) => {
        router.get(window.location.pathname, { filter });
    };

    return (
        <div className="mb-4">
            <div className="mb-4">
                <h1 className="flex gap-2 items-center text-lg font-semibold text-foreground lg:text-2xl">
                    <FileCheck className="h-5 w-5 text-primary" />
                    My All Submissions Report
                </h1>
                <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                    View and manage all your report submissions
                </p>
            </div>

            {/* Underline style filters */}
            <div className="border-b border-border">
                <div className="flex gap-1">
                    {filters.map((filter) => {
                        const isActive = activeFilter === filter.key;

                        return (
                            <button
                                key={filter.key}
                                onClick={() => handleFilterClick(filter.key)}
                                className={`relative px-4 py-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none lg:text-sm ${
                                    isActive
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                } `}
                            >
                                {filter.label}
                                {isActive && (
                                    <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-primary" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
