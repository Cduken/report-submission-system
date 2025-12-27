import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Folder } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

interface Report {
    title: string;
    deadline: Date;
    final_deadline: Date;
}

interface ReportDialogProps {
    setReports: Dispatch<SetStateAction<Report[]>>;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function ReportDialog({
    setReports,
    setOpen,
    open,
}: ReportDialogProps) {
    const [report, setReport] = useState<Report>({
        title: '',
        deadline: new Date(),
        final_deadline: new Date(),
    });

    const handleCreate = () => {
        setReports((prev) => [...prev, report]); // add new report
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <div className="flex justify-end">
                        <Button type="button" variant={'secondary'}>
                            <Folder className="mr-2 h-4 w-4" />
                            <span>Create new Report</span>
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="">
                    <DialogHeader>
                        <DialogTitle>Create New Report</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to create a new report.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        {/* form's fields */}
                        <div className="">
                            <Label>Report Title</Label>
                            <Input
                                value={report?.title}
                                onChange={(e) =>
                                    setReport({
                                        ...report,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label>Deadline</Label>
                            <Input
                                type="date"
                                onChange={(e) =>
                                    setReport({
                                        ...report,
                                        deadline: new Date(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label>Final Deadline</Label>
                            <Input
                                type="date"
                                onChange={(e) =>
                                    setReport({
                                        ...report,
                                        final_deadline: new Date(
                                            e.target.value,
                                        ),
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="type"
                                className="text-sm font-medium"
                            >
                                Report Type{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select name="type" defaultValue={''}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="male">
                                            Sample TYpe
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Sample TYpe
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Other
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {/* <InputError message={errors.type} /> */}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button type="button" onClick={handleCreate}>
                                Create Report
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    );
}
