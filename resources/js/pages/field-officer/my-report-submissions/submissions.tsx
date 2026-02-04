import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import { Calendar, User, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type GroupedSubmissions = Record<string, ReportSubmission[]>;

export default function Submissions() {
    const { mySubmissions } = usePage<{ mySubmissions: ReportSubmission[] }>()
        .props;

    // Group submissions by date
    const groupedSubmissions: GroupedSubmissions =
        mySubmissions.reduce<GroupedSubmissions>((acc, submission) => {
            const dateKey = new Date(submission.created_at).toLocaleDateString(
                'en-US',
                {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                },
            );

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(submission);
            return acc;
        }, {});

    // Get status details
    const getStatusDetails = (status: string) => {
        switch (status.toLowerCase()) {
            case 'submitted':
                return {
                    icon: CheckCircle,
                    color: 'text-chart-2',
                    bgColor: 'bg-chart-2/10',
                    borderColor: 'border-chart-2/20',
                    label: 'Submitted'
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'text-amber-500',
                    bgColor: 'bg-amber-500/10',
                    borderColor: 'border-amber-500/20',
                    label: 'Pending'
                };
            case 'approved':
                return {
                    icon: CheckCircle,
                    color: 'text-green-500',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/20',
                    label: 'Approved'
                };
            default:
                return {
                    icon: AlertCircle,
                    color: 'text-chart-4',
                    bgColor: 'bg-chart-4/10',
                    borderColor: 'border-chart-4/20',
                    label: status.charAt(0).toUpperCase() + status.slice(1)
                };
        }
    };

    // Format time
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="space-y-8 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground">My Submissions</h1>
                <p className="text-muted-foreground mt-1">
                    {mySubmissions.length} report{mySubmissions.length !== 1 ? 's' : ''} submitted
                </p>
            </div>

            {Object.entries(groupedSubmissions).length > 0 ? (
                Object.entries(groupedSubmissions).map(
                    ([date, submissions]: [string, ReportSubmission[]]) => (
                        <div key={date} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/5 rounded-lg">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Submitted on
                                    </p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {date}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {submissions.map((submission: ReportSubmission) => {
                                    const statusDetails = getStatusDetails(submission.status);
                                    const StatusIcon = statusDetails.icon;

                                    return (
                                        <Card
                                            key={submission.id}
                                            className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/20"
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="p-1.5 bg-primary/5 rounded-md">
                                                                <FileText className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <CardTitle className="text-base font-semibold">
                                                                Report #{submission.id}
                                                            </CardTitle>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">
                                                            Submitted at {formatTime(submission.created_at)}
                                                        </p>
                                                    </div>
                                                    <div className={`px-3 py-1.5 rounded-full ${statusDetails.bgColor} ${statusDetails.borderColor} border`}>
                                                        <div className="flex items-center gap-1.5">
                                                            <StatusIcon className={`h-3.5 w-3.5 ${statusDetails.color}`} />
                                                            <span className={`text-xs font-medium ${statusDetails.color}`}>
                                                                {statusDetails.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">
                                                                Field Officer
                                                            </p>
                                                            <p className="text-sm font-medium text-foreground">
                                                                {submission.field_officer.name}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* {submission.description && (
                                                        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                                            <p className="text-xs text-muted-foreground mb-1">
                                                                Description
                                                            </p>
                                                            <p className="text-sm text-foreground line-clamp-2">
                                                                {submission.description}
                                                            </p>
                                                        </div>
                                                    )} */}

                                                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/50">
                                                        <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                                                            View Details
                                                        </button>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(submission.updated_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ),
                )
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-muted/30 rounded-full mb-4">
                        <FileText className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">
                        No submissions yet
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                        You haven't submitted any reports yet. Your submissions will appear here once you start submitting reports.
                    </p>
                </div>
            )}
        </div>
    );
}
