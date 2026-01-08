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
// Back to using the Form component wrapper
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

    // 1. Local State (Just like your TestReportDialog pattern)
    // We use this to make the inputs "Controlled" so we can see what we type
    const [answers, setAnswers] = useState<Record<string, any>>({});

    // Helper to update local state
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
                    encType="multipart/form-data" // Required for files to work
                    onSuccess={() => {
                        setOpen(false);
                        setAnswers({}); // Reset local state
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="mt-4 space-y-6">
                            {/* --- STATIC FIELDS --- */}
                            <div className="space-y-4 rounded-md border bg-gray-50/50 p-4">
                                <h4 className="text-sm font-semibold text-gray-900">
                                    General Information
                                </h4>

                                {/* Hidden Input for Report ID */}
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
                                        name="description" // Standard HTML name
                                        placeholder="General remarks about this report..."
                                        className="bg-white"
                                    />
                                    <InputError message={errors.description} />
                                </div>
                            </div>

                            {/* --- DYNAMIC FIELDS --- */}
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

                                                {/* CRITICAL PART:
                                                    We use the `name` attribute with array syntax.
                                                    Laravel reads this as: $request->input('submission_data')[field_id]
                                                */}

                                                {field.type === 'textarea' ? (
                                                    <Textarea
                                                        id={field.id}
                                                        name={`submission_data[${field.id}]`}
                                                        required={
                                                            field.required
                                                        }
                                                        value={
                                                            answers[field.id] ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            handleFieldChange(
                                                                field.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                ) : field.type === 'file' ? (
                                                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 hover:bg-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            <UploadCloud className="h-5 w-5 text-gray-400" />
                                                            {/* File inputs are Uncontrolled (no value prop) */}
                                                            <Input
                                                                id={field.id}
                                                                type="file"
                                                                name={`submission_data[${field.id}]`}
                                                                required={
                                                                    field.required
                                                                }
                                                                className="border-0 p-0 shadow-none"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    // For files, we just let the native input handle it,
                                                                    // but we update state just to track that it changed if needed
                                                                    if (
                                                                        e.target
                                                                            .files?.[0]
                                                                    ) {
                                                                        handleFieldChange(
                                                                            field.id,
                                                                            e
                                                                                .target
                                                                                .files[0],
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Input
                                                        id={field.id}
                                                        type={field.type}
                                                        name={`submission_data[${field.id}]`}
                                                        required={
                                                            field.required
                                                        }
                                                        value={
                                                            answers[field.id] ||
                                                            ''
                                                        }
                                                        onChange={(e) =>
                                                            handleFieldChange(
                                                                field.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                )}

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
