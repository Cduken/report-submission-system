// components/submission-card.tsx
import { ReportSubmission } from '@/types';
import { Calendar, FileText, User, ChevronRight, Building, Paperclip } from 'lucide-react';
import { SubmissionStatusBadge } from './submission-status-badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface SubmissionCardProps {
    submission: ReportSubmission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
    const formattedDate = new Date(submission.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    // Get title from report or use fallback
    const title = submission.report?.title || `Report Submission #${submission.id}`;

    // Get program name if available
    const programName = submission.report?.program?.name;

    // Get field officer name
    const userName = submission.fieldOfficer?.name || 'Unknown';

    return (
        <Card className="group hover:shadow-md transition-shadow duration-200 border-border">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                                {title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground truncate">
                                    Submitted on {formattedDate}
                                </span>
                            </div>
                        </div>
                    </div>
                    <SubmissionStatusBadge status={submission.status} />
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="space-y-3">
                    {programName && (
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">Program:</span>
                            <span className="text-sm font-medium text-foreground">
                                {programName}
                            </span>
                        </div>
                    )}

                    <Separator className="my-2" />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-muted-foreground">Submitted By</p>
                            <div className="flex items-center gap-2 mt-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-foreground truncate">
                                    {userName}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">Attachments</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs">
                                    {submission.media?.length || 0} files
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {submission.report?.description && (
                        <>
                            <Separator className="my-2" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                                <p className="text-sm text-foreground line-clamp-2">
                                    {submission.report.description}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <div className="flex w-full items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                        Report ID: #{submission.report_id}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 group-hover:bg-accent"
                        asChild
                    >
                        <a href={`/field-officer/submissions/${submission.id}`}>
                            View Details
                            <ChevronRight className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
