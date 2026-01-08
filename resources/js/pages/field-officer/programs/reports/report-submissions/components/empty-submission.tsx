import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Folder } from 'lucide-react';

export default function EmptyReportSubmission({
    setIsOpen,
}: {
    setIsOpen: (open: boolean) => void;
}) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                    <Folder />
                </EmptyMedia>
                <EmptyTitle>No Report Submissions Created Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t submitted any reports yet. Get started by
                    submitting your first report.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button onClick={() => setIsOpen(true)}>
                        Submit Report
                    </Button>
                </div>
            </EmptyContent>
        </Empty>
    );
}
