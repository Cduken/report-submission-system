import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';

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

    return (
        <div className="space-y-8 p-6">
            {Object.entries(groupedSubmissions).map(
                ([date, submissions]: [string, ReportSubmission[]]) => (
                    <div key={date} className="space-y-3">
                        <p className="text-lg font-semibold text-gray-700">
                            Submitted on: {date}
                        </p>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {submissions.map((submission: ReportSubmission) => (
                                <Card key={submission.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            ID: {submission.id}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div
                                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                                                submission.status ===
                                                'submitted'
                                                    ? 'bg-chart-2/20 text-chart-2'
                                                    : 'bg-chart-4/20 text-chart-4'
                                            }`}
                                        >
                                            {submission.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                submission.status.slice(1)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Officer:{' '}
                                            {submission.field_officer.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ),
            )}
        </div>
    );
}
