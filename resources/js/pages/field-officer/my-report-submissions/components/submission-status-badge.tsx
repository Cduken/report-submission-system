// components/submission-status-badge.tsx
import { CheckCircle2, Clock, XCircle, FileEdit, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: string;
}

export function SubmissionStatusBadge({ status }: StatusBadgeProps) {
    const statusConfig = {
        approved: {
            label: 'Approved',
            variant: 'default' as const,
            icon: CheckCircle2,
            className: 'bg-green-500/15 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900',
        },
        pending: {
            label: 'Pending Review',
            variant: 'secondary' as const,
            icon: Clock,
            className: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900',
        },
        rejected: {
            label: 'Rejected',
            variant: 'destructive' as const,
            icon: XCircle,
            className: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900',
        },
        draft: {
            label: 'Draft',
            variant: 'outline' as const,
            icon: FileEdit,
            className: 'bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
        },
        submitted: {
            label: 'Submitted',
            variant: 'default' as const,
            icon: Send,
            className: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
        },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        variant: 'outline' as const,
        icon: Clock,
        className: '',
    };

    const Icon = config.icon;

    return (
        <Badge
            variant={config.variant}
            className={`gap-1.5 font-medium ${config.className}`}
        >
            <Icon className="h-3.5 w-3.5" />
            {config.label}
        </Badge>
    );
}
