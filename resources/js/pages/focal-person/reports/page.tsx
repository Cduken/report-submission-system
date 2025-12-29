import AppLayout from '@/layouts/app-layout';
import { EllipsisVertical, Folder } from 'lucide-react';
import { Activity, useState } from 'react';
import { breadcrumbs } from '../dashboard/page';
import EmptyReport from './components/empty-report';
import ReportDialog from './components/report-dialog';

interface Report {
    title: string;
    deadline: Date;
    final_deadline: Date;
}

export default function CreateReport() {
    const [open, setOpen] = useState<boolean>(false);
    const [reports, setReports] = useState<Report[]>([]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-5 p-3">
                <ReportDialog
                    setReports={setReports}
                    open={open}
                    setOpen={setOpen}
                />

                <Activity mode={reports.length === 0 ? 'visible' : 'hidden'}>
                    <EmptyReport setIsOpen={setOpen} />
                </Activity>

                <Activity mode={reports.length > 0 ? 'visible' : 'hidden'}>
                    <div className="grid grid-cols-3 gap-5">
                        {reports.map((report, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-5 rounded-xl border bg-background/50 px-4 py-2"
                            >
                                <div>
                                    <Folder />
                                </div>
                                <div className="flex w-full items-center justify-between">
                                    <div>
                                        <h2 className="truncate text-lg font-semibold">
                                            {report.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Deadline:{' '}
                                            {report.deadline.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Activity>
            </div>
        </AppLayout>
    );
}
