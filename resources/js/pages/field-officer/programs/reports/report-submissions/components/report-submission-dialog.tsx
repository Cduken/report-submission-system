import ReportSubmissionController from '@/actions/App/Http/Controllers/ReportSubmissionController';
import InputError from '@/components/input-error';
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
import { Folder, UploadCloud } from 'lucide-react';
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

    const handleFieldChange = (fieldId: string, value: any) => {
        setAnswers((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    console.log(report);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!hasSubmitted ? (
                <DialogTrigger asChild>
                    <div className="flex justify-end">
                        <Button type="button" variant="secondary">
                            <Folder className="mr-2 h-4 w-4" />
                            Submit Report
                        </Button>
                    </div>
                </DialogTrigger>
            ) : (
                <div className="flex justify-end">
                    <Button type="button" variant="secondary" disabled>
                        <Folder className="mr-2 h-4 w-4" />
                        You already Submitted
                    </Button>
                </div>
            )}

            <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Submit Report: {report.title}</DialogTitle>
                    <DialogDescription>
                        Please fill out the required information below.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ReportSubmissionController.store.form()}
                    encType="multipart/form-data"
                    onSuccess={() => {
                        setOpen(false);
                        setAnswers({});
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="mt-4 space-y-6">
                            <div className="space-y-4 rounded-md border bg-gray-50/50 p-4">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    General Information
                                </h4>

                                <input
                                    type="hidden"
                                    name="report_id"
                                    value={report.id}
                                />

                                <div>
                                    <Label htmlFor="description">
                                        Description / Notes
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="General remarks about this report..."
                                        className="bg-white"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        Required Data
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                        {schema.length} field(s) required
                                    </span>
                                </div>

                                {schema.length === 0 ? (
                                    <div className="py-4 text-center text-sm text-gray-500 italic">
                                        No additional data fields required.
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {schema.map((field) => (
                                            <div
                                                key={field.id}
                                                className="space-y-2"
                                            >
                                                <Label htmlFor={field.id}>
                                                    {field.label}
                                                    {field.required && (
                                                        <span className="ml-1 text-red-500">
                                                            *
                                                        </span>
                                                    )}
                                                </Label>
                                                <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 hover:bg-gray-50">
                                                    <div className="flex items-center gap-3">
                                                        <UploadCloud className="h-5 w-5 text-gray-400" />
                                                        {/* File inputs are Uncontrolled (no value prop) */}
                                                        <Input
                                                            id={field.id}
                                                            type="file"
                                                            multiple
                                                            name={`submission_data[${field.id}][]`}
                                                            required={
                                                                field.required
                                                            }
                                                            className="border-0 p-0 shadow-none"
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .files &&
                                                                    e.target
                                                                        .files
                                                                        .length >
                                                                        0
                                                                ) {
                                                                    handleFieldChange(
                                                                        field.id,
                                                                        Array.from(
                                                                            e
                                                                                .target
                                                                                .files,
                                                                        ),
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <div className="text-sm font-medium text-gray-700">
                                                            Click to upload
                                                            files
                                                        </div>
                                                        <p className="text-xs text-gray-400">
                                                            Supports multiple
                                                            files (PDF, IMG,
                                                            DOCX)
                                                        </p>
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

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Submitting...'
                                        : 'Submit Report'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
