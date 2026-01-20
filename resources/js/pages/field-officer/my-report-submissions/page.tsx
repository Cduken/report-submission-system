// page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { usePage, WhenVisible } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    FilePlus,
    FileText,
} from 'lucide-react';
import { breadcrumbs } from '../dashboard/page';
import { SubmissionSkeleton } from './components/submission-skeleton';
import Submissions from './submissions';

interface Submission {
    status: 'draft' | 'submitted' | 'pending' | 'approved';
}

export default function MyReports() {
    const { mySubmissions } = usePage<{ mySubmissions: Submission[] }>().props;

    // Calculate stats from actual data
    const total = mySubmissions?.length || 0;
    const submitted =
        mySubmissions?.filter((s) => s.status === 'submitted').length || 0;
    const draft =
        mySubmissions?.filter((s) => s.status === 'draft').length || 0;
    const approved =
        mySubmissions?.filter((s) => s.status === 'approved').length || 0;
    const pending =
        mySubmissions?.filter((s) => s.status === 'pending').length || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                                    My Report Submissions
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Track and manage all your submitted reports
                                    in one place
                                </p>
                            </div>
                            <Button className="gap-2" asChild>
                                <a href="/field-officer/programs">
                                    <FilePlus className="h-4 w-4" />
                                    New Submission
                                </a>
                            </Button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Total
                                            </p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {total}
                                            </p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <BarChart3 className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Submitted
                                            </p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {submitted}
                                            </p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                                            <FileText className="h-6 w-6 text-blue-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Drafts
                                            </p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {draft}
                                            </p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-500/10">
                                            <FileText className="h-6 w-6 text-gray-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Approved
                                            </p>
                                            <p className="text-2xl font-bold text-foreground">
                                                {approved}
                                            </p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                                            <CheckCircle className="h-6 w-6 text-green-500" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    Recent Submissions
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    View and manage your report submissions
                                </p>
                            </div>

                            {pending > 0 && (
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="text-sm font-medium">
                                        {pending} pending review
                                    </span>
                                </div>
                            )}
                        </div>

                        <WhenVisible
                            data={'mySubmissions'}
                            fallback={<SubmissionSkeleton />}
                        >
                            <Submissions />
                        </WhenVisible>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
