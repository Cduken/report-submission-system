import AppLayout from '@/layouts/app-layout';
import { breadcrumbs } from '@/pages/field-officer/dashboard/page';
import { ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import SubmissionCard from './components/submission-card';

export default function Submission() {
    const { submissions = [] } = usePage<{ submissions: ReportSubmission[] }>()
        .props;
    const [statusFilter, setStatusFilter] = useState<
        'all' | ReportSubmission['status']
    >('all');

    const filtered =
        statusFilter === 'all'
            ? submissions
            : submissions.filter((s) => s.status === statusFilter);

    const counts = submissions.reduce(
        (acc, s) => {
            acc[s.status] = (acc[s.status] ?? 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full px-6 py-6">
                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="mb-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-transparent px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:text-foreground dark:hover:bg-gray-900"
                >
                    <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Back
                </button>

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="lg:text-2xl font-bold text-gray-900 dark:text-foreground">
                        Report Submissions
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {submissions.length} submission
                        {submissions.length !== 1 ? 's' : ''} total
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex lg:flex-nowrap w-full mb-5 gap-1 border-b border-gray-200">
                    {(
                        [
                            'all',
                            'draft',
                            'submitted',
                            'accepted',
                            'returned',
                        ] as const
                    ).map((status) => {
                        const count =
                            status === 'all'
                                ? submissions.length
                                : (counts[status] ?? 0);
                        const isActive = statusFilter === status;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`-mb-px flex-1 lg:flex-none inline-flex justify-center items-center gap-1.5 border-b-2 bg-transparent px-2 lg:px-3.5 py-2 text-xs lg:text-sm capitalize transition-colors ${
                                    isActive
                                        ? 'border-black dark:border-indigo-600 font-semibold text-black dark:text-white'
                                        : 'border-transparent font-normal text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {status}
                                {count > 0 && (
                                    <span
                                        className={`rounded-full px-1.5 py-px text-xs font-semibold ${
                                            isActive
                                                ? 'bg-gray-100 text-black'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Cards */}
                {filtered.length === 0 ? (
                    <div className="py-16 text-center text-sm text-gray-400">
                        <div className='flex flex-col gap-2 justify-center'>
                            <img
                                src="/Images/no-report.svg"
                                alt="Empty State"
                                className='h-15 lg:h-30 dark:opacity-45'
                            />
                            <p>No submissions found.</p>
                        </div>

                    </div>
                ) : (
                    <div className="grid grid-rows-1 lg:grid-cols-3 gap-3 ">
                        {filtered.map((submission) => (
                            <SubmissionCard
                                key={submission.id}
                                submission={submission}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
