import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ReportSubmission } from '@/types';
import { EllipsisVertical, FileText } from 'lucide-react';

export default function ListView({
    reportSubmissions,
    onRowClick,
}: {
    reportSubmissions: ReportSubmission[];
    onRowClick: (submission: ReportSubmission) => void;
}) {
    return (
        <div className="space-y-2">
            {/* Table Header */}
             <div className="ml-8 lg:ml-0 flex items-center gap-4 lg:gap-4 lg:px-4 px-3 py-2 text-xs font-medium text-muted-foreground">
                <div className="lg:w-10"></div>
                <div className="ml-3 lg:ml-0 lg:min-w-0 flex-1">Name</div>
                <div className="lg:w-32">Date Submitted</div>
                <div className="lg:w-20">Files</div>
                <div className="lg:w-10 w-8"></div>
            </div>

            {/* Table Rows */}
            {reportSubmissions.map((submission) => (
                <button
                    key={submission.id}
                    onClick={() => onRowClick(submission)}
                    className="group flex w-full cursor-pointer items-center gap-4 rounded-lg border border-border bg-background px-4 py-3 text-left transition hover:bg-muted/40"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-500 text-sm font-semibold text-white">
                            {submission.field_officer?.name
                                ?.split(' ')
                                .map((n: any) => n[0])
                                .join('')
                                .toUpperCase() || 'FO'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">
                            {submission.field_officer?.name ||
                                'Unknown Officer'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Report Submission
                        </span>
                    </div>

                    <div className="ml-2 lg:w-32 lg:ml-2 ">
                        <span className="text-sm text-muted-foreground">
                            {new Date(submission.created_at).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </span>
                    </div>

                    <div className="flex lg:w-20 items-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {submission.media?.length || 0}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                        className="rounded-full p-2 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-muted"
                        aria-label="More actions"
                    >
                        <EllipsisVertical className="h-4 w-4" />
                    </button>
                </button>
            ))}
        </div>
    );
}
