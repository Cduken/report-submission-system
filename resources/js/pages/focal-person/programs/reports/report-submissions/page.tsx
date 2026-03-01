import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import Back from '@/components/back';
import { Button } from '@/components/ui/button';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Program, Report, ReportSubmission } from '@/types';
import { usePage } from '@inertiajs/react';
import { Download, Grid2x2, List } from 'lucide-react';
import { Activity, useState } from 'react';
import GridView from './components/grid-view';
import ListView from './components/list-view';
import ReportSubmissionDrawer from './components/report-submission-drawer';

export default function page() {
    const { report, reportSubmissions, program } = usePage<{
        report: Report;
        reportSubmissions: ReportSubmission[];
        program: Program;
    }>().props;

    const { mode: viewMode, updateMode: setViewMode } = useViewMode();

    // Lift drawer state to parent
    const [selectedSubmission, setSelectedSubmission] =
        useState<ReportSubmission | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCardClick = (submission: ReportSubmission) => {
        setSelectedSubmission(submission);
        setIsDrawerOpen(true);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `Programs/${program.name}/Reports/${report.title}/Report Submissions`,
            href: ViewController.reportSubmissions([program, report]).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Back link={ViewController.reports(program)} />

                <div className='flex items-center justify-between'>
                    <h1 className="text-lg lg:text-xl font-semibold truncate">{report.title}</h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                }`}
                                title="Grid view"
                            >
                                <Grid2x2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`rounded p-2 transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                }`}
                                title="List view"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        <Button asChild variant="outline" size="sm">
                            <a
                                href={`/downloads/folder/${report.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Download />
                                Download All
                            </a>
                        </Button>
                    </div>
                </div>

                <Activity
                    mode={reportSubmissions.length === 0 ? 'visible' : 'hidden'}
                >
                    <div className="flex h-[60vh] items-center justify-center">
                        <div>
                            <img
                                src="/Images/no-report.svg"
                                alt="No report"
                                className="mb-2 h-30"
                            />
                            <p className="text-center text-gray-500">
                                No reports yet
                            </p>
                        </div>
                    </div>
                </Activity>

                <Activity
                    mode={reportSubmissions.length > 0 ? 'visible' : 'hidden'}
                >
                    {viewMode === 'grid' ? (
                        <GridView
                            reportSubmissions={reportSubmissions}
                            onCardClick={handleCardClick}
                        />
                    ) : (
                        <ListView
                            reportSubmissions={reportSubmissions}
                            onRowClick={handleCardClick}
                        />
                    )}
                </Activity>
            </div>
            {/* Single drawer instance shared by both views */}
            <ReportSubmissionDrawer
                submission={selectedSubmission}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </AppLayout>
    );
}
