import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ReportSubmission } from '@/types';
import { FileText } from 'lucide-react';

export default function GridView({
    reportSubmissions,
    onCardClick,
}: {
    reportSubmissions: ReportSubmission[];
    onCardClick: (submission: ReportSubmission) => void;
}) {
    return (
        <div className="grid grid-rows-1 lg:grid-cols-3 gap-5">
            {reportSubmissions.map((submission) => (
                <button
                    key={submission.id}
                    onClick={() => onCardClick(submission)}
                    className="group relative flex cursor-pointer flex-col items-center rounded-xl border border-border bg-background p-6 text-center transition hover:border-gray-500/50 hover:shadow-lg"
                >
                    {/* Avatar */}
                    <Avatar className="mb-3 h-16 w-16">
                        <AvatarFallback className="bg-gray-500 text-lg font-semibold text-white">
                            {submission.field_officer?.name
                                ?.split(' ')
                                .map((n: any) => n[0])
                                .join('')
                                .toUpperCase() || 'FO'}
                        </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <h3 className="mb-1 text-base font-semibold">
                        {submission.field_officer?.name || 'Unknown Officer'}
                    </h3>

                    {/* Submission Date */}
                    <p className="mb-3 text-xs text-muted-foreground">
                        Submitted on{' '}
                        {new Date(submission.created_at).toLocaleDateString(
                            'en-US',
                            {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            },
                        )}
                    </p>

                    {/* File Count Badge */}
                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium">
                            {submission.media?.length || 0} file
                            {submission.media?.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Status Badge (Optional) */}
                    {submission.status === 'accepted' && (
                        <div className="absolute top-3 right-3 rounded-full bg-teal-500 px-2 py-0.5 text-xs font-medium text-white">
                            Accepted
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
