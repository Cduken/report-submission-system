/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ReportSubmissionController from '@/actions/App/Http/Controllers/ReportSubmissionController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Report } from '@/types';
import { Form } from '@inertiajs/react';
import { AlertCircle, FileText, Folder, UploadCloud } from 'lucide-react';
import { useState } from 'react';

interface DynamicFieldDefinition {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'textarea' | 'file';
    required: boolean;
}

interface ReportSubmissionDialogProps {
    open: boolean;
    hasSubmitted: boolean;
    setOpen: (open: boolean) => void;
    report: Report;
}

export default function ReportSubmissionDialog({
    open,
    hasSubmitted,
    setOpen,
    report,
}: ReportSubmissionDialogProps) {
    const schema = (report.form_schema || []) as DynamicFieldDefinition[];

    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>(
        {},
    );

    const handleFieldChange = (fieldId: string, files: FileList | null) => {
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            setSelectedFiles((prev) => ({
                ...prev,
                [fieldId]: fileArray,
            }));
            setAnswers((prev) => ({
                ...prev,
                [fieldId]: fileArray.map((f) => f.name).join(', '),
            }));
        }
    };

    const getFileTypeIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return '📄';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return '🖼️';
        if (['doc', 'docx'].includes(ext || '')) return '📝';
        if (['xls', 'xlsx'].includes(ext || '')) return '📊';
        return '📎';
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!hasSubmitted ? (
                <DialogTrigger asChild>
                    <Button type="button" variant="default" className="gap-2">
                        <Folder className="h-4 w-4" />
                        Submit Report
                    </Button>
                </DialogTrigger>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="gap-2 opacity-60 text-xs lg:text-sm"
                >
                    <FileText className="h-4 w-4 " />
                    Already Submitted
                </Button>
            )}

            <DialogContent className="max-h-[85vh] overflow-y-auto p-0">
                <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4">
                    <DialogHeader>
                        <DialogTitle className="text-sm lg:text-xl text-foreground">
                            Submit Report:{' '}
                            <span className="text-primary">{report.title}</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs lg:text-base text-muted-foreground">
                            Please fill out the required information below.
                            Fields marked with{' '}
                            <span className="text-destructive">*</span> are
                            required.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Form
                    {...ReportSubmissionController.store.form()}
                    encType="multipart/form-data"
                    onSuccess={() => {
                        setOpen(false);
                        setAnswers({});
                        setSelectedFiles({});
                    }}
                    className="px-6 pb-6"
                >
                    {({ processing, errors }) => (
                        <div className="mt-4 space-y-6">
                            {/* General Information Section */}
                            <div className="space-y-4 rounded-lg border border-border bg-card/50 p-5">
                                <div className="flex items-center gap-2 border-b border-border pb-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <h4 className="text-sm lg:text-base font-semibold text-foreground">
                                        General Information
                                    </h4>
                                </div>

                                <input
                                    type="hidden"
                                    name="report_id"
                                    value={report.id}
                                />

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="description"
                                        className="text-sm lg:text-base text-foreground"
                                    >
                                        Description / Notes
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Add any general remarks or notes about this submission..."
                                        className="min-h-[100px] border-input bg-background focus:border-ring focus:ring-ring"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            {/* Required Data Section */}
                            <div className="space-y-4 rounded-lg border border-border bg-card/50 p-5">
                                <div className="flex items-center justify-between border-b border-border pb-2">
                                    <div className="flex items-center gap-2">
                                        <UploadCloud className="h-5 w-5 text-muted-foreground" />
                                        <h4 className="text-sm lg:text-base font-semibold text-foreground">
                                            Required Documents
                                        </h4>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-background"
                                    >
                                        {schema.length} field(s)
                                    </Badge>
                                </div>

                                {schema.length === 0 ? (
                                    <div className="flex items-center justify-center gap-2 py-8 text-center">
                                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground italic">
                                            No additional documents required for
                                            this report.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {schema.map((field) => (
                                            <div
                                                key={field.id}
                                                className="space-y-2"
                                            >
                                                <Label
                                                    htmlFor={field.id}
                                                    className="flex items-center gap-1 text-foreground"
                                                >
                                                    {field.label}
                                                    {field.required && (
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    )}
                                                </Label>

                                                <div className="relative rounded-lg border-2 border-dashed border-input bg-background transition-colors hover:border-primary/50 hover:bg-accent/5">
                                                    <Input
                                                        id={field.id}
                                                        type="file"
                                                        multiple
                                                        name={`submission_data[${field.id}][]`}
                                                        required={
                                                            field.required
                                                        }
                                                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                        onChange={(e) => {
                                                            handleFieldChange(
                                                                field.id,
                                                                e.target.files,
                                                            );
                                                        }}
                                                    />

                                                    <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 p-4 overflow-y-hidden">
                                                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                                        <div className="text-center">
                                                            <p className="text-sm font-medium text-foreground">
                                                                Click to upload
                                                                or drag and drop
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Supports: PDF,
                                                                Images, DOCX
                                                                (Max 10MB each)
                                                            </p>
                                                        </div>

                                                        {/* Show selected files */}
                                                        {selectedFiles[
                                                            field.id
                                                        ] &&
                                                            selectedFiles[
                                                                field.id
                                                            ].length > 0 && (
                                                                <div className="mt-2 w-full max-w-sm overflow-hidden rounded-md border border-border bg-background/50 p-2">
                                                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                                        Selected
                                                                        files:
                                                                    </p>
                                                                    <div className="">
                                                                        {selectedFiles[
                                                                            field
                                                                                .id
                                                                        ].map(
                                                                            (
                                                                                file,
                                                                                idx,
                                                                            ) => (
                                                                                <div

                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className="flex items-center gap-2 rounded bg-accent/30 px-2 py-1 text-xs"
                                                                                >
                                                                                    <span className="text-base">
                                                                                        {getFileTypeIcon(
                                                                                            file.name,
                                                                                        )}
                                                                                    </span>
                                                                                    <span className="flex-1 w-20 truncate text-foreground">
                                                                                        {
                                                                                            file.name
                                                                                        }
                                                                                    </span>
                                                                                    <span className="text-muted-foreground">
                                                                                        (
                                                                                        {(
                                                                                            file.size /
                                                                                            1024
                                                                                        ).toFixed(
                                                                                            0,
                                                                                        )}{' '}
                                                                                        KB)
                                                                                    </span>
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>

                                                <InputError
                                                    message={
                                                        errors[
                                                            `submission_data.${field.id}`
                                                        ]
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-border bg-card py-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setOpen(false);
                                        setAnswers({});
                                        setSelectedFiles({});
                                    }}
                                    className="gap-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-4 w-4" />
                                            Submit Report
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
