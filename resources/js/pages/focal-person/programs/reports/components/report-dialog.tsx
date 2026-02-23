import ReportController from '@/actions/App/Http/Controllers/ReportController';
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
import { cn } from '@/lib/utils';
import { Program } from '@/types';
import { Form } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Download,
    FileSignature,
    FileText,
    FileUp,
    Folder,
    Plus,
    Trash2,
    UploadCloud,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface ReportDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    program: Program;
}

type FieldType = 'file';

interface DynamicField {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
}

export default function ReportDialog({
    setOpen,
    open,
    program,
}: ReportDialogProps) {
    const [fields, setFields] = useState<DynamicField[]>([]);
    const [templateFiles, setTemplateFiles] = useState<FileList | null>(null);
    const [referenceFiles, setReferenceFiles] = useState<FileList | null>(null);
    const referenceFileInputRef = useRef<HTMLInputElement>(null);
    const templateFileInputRef = useRef<HTMLInputElement>(null);

    const addField = () => {
        setFields([
            ...fields,
            {
                id: crypto.randomUUID(),
                label: '',
                type: 'file',
                required: true,
            },
        ]);
    };

    const updateLabel = (id: string, value: string) => {
        setFields((prev) =>
            prev.map((field) =>
                field.id === id ? { ...field, label: value } : field,
            ),
        );
    };

    const removeField = (id: string) => {
        setFields((prev) => prev.filter((f) => f.id !== id));
    };

    const clearReferenceFiles = () => {
        setReferenceFiles(null);
        if (referenceFileInputRef.current) {
            referenceFileInputRef.current.value = '';
        }
    };

    const clearTemplateFiles = () => {
        setTemplateFiles(null);
        if (templateFileInputRef.current) {
            templateFileInputRef.current.value = '';
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="default" className="shadow-sm">
                    <Folder className="mr-2 h-4 w-4" />
                    <span>Create New Report</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0">
                <div className="sticky top-0 z-10 border-b bg-white px-6 py-4">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Create New Report
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Define the report details and upload any templates
                            for the officers.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Form
                    {...ReportController.store.form()}
                    onSuccess={() => {
                        setOpen(false);
                        setFields([]);
                        setTemplateFiles(null);
                        setReferenceFiles(null);
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-8 px-6 pb-6">
                            {/* Basic Information Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                                        <FileSignature className="h-3.5 w-3.5 text-blue-600" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Basic Information
                                    </h3>
                                </div>

                                <div className="space-y-4 rounded-xl border bg-white p-5 shadow-sm">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="title"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Report Title{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            placeholder="e.g. Q1 Compliance Report"
                                            className="border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Report Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Provide instructions or context for the officers..."
                                            className="min-h-[100px] border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <p className="text-xs text-gray-400">
                                            Include any specific guidelines or
                                            requirements for this report.
                                        </p>
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    {/* Hidden Program ID */}
                                    <Input
                                        hidden
                                        name="program_id"
                                        value={program.id}
                                        readOnly
                                    />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="deadline"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Deadline{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative">
                                                <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    type="date"
                                                    name="deadline"
                                                    id="deadline"
                                                    className="border-gray-200 bg-white pl-9 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <InputError
                                                message={errors.deadline}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Required Attachments Section */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                                            <FileText className="h-3.5 w-3.5 text-purple-600" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Required Attachments
                                        </h3>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addField}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 border-purple-200 text-xs text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                                    >
                                        <Plus className="mr-1 h-3.5 w-3.5" />
                                        Add Attachment Field
                                    </Button>
                                </div>

                                <div className="rounded-xl border bg-white p-5 shadow-sm">
                                    {fields.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                                                <FileText className="h-6 w-6 text-purple-300" />
                                            </div>
                                            <p className="mt-2 text-sm font-medium text-gray-700">
                                                No attachments requested
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Add attachment fields that
                                                officers need to upload
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="group relative flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 transition-all hover:border-gray-300 hover:bg-white"
                                                >
                                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-purple-100 text-purple-600">
                                                        <FileText className="h-4 w-4" />
                                                    </div>

                                                    <div className="flex-1 space-y-1">
                                                        <Label className="text-xs font-medium text-gray-500">
                                                            Attachment Name #
                                                            {index + 1}
                                                        </Label>
                                                        <Input
                                                            value={field.label}
                                                            onChange={(e) =>
                                                                updateLabel(
                                                                    field.id,
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="e.g. Signed Agreement, Financial Statement..."
                                                            className="h-9 border-gray-200 bg-white text-sm focus:border-purple-500 focus:ring-purple-500"
                                                        />
                                                        <p className="text-xs text-gray-400">
                                                            Officers will be
                                                            required to upload
                                                            this file
                                                        </p>
                                                    </div>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                                                        onClick={() =>
                                                            removeField(
                                                                field.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reference Files Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                                        <Download className="h-3.5 w-3.5 text-emerald-600" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Reference Materials
                                    </h3>
                                </div>

                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5 shadow-sm">
                                    <div className="mb-3 flex items-center justify-between">
                                        <Label className="text-sm font-medium text-emerald-900">
                                            Upload Reference Files
                                        </Label>
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                            Optional
                                        </span>
                                    </div>

                                    <div
                                        className={cn(
                                            'relative cursor-pointer rounded-lg border-2 border-dashed transition-all',
                                            referenceFiles
                                                ? 'border-emerald-300 bg-emerald-50/50'
                                                : 'border-emerald-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50',
                                        )}
                                        onClick={() =>
                                            referenceFileInputRef.current?.click()
                                        }
                                    >
                                        <Input
                                            ref={referenceFileInputRef}
                                            type="file"
                                            multiple
                                            name="reference_files[]"
                                            className="hidden"
                                            onChange={(e) =>
                                                setReferenceFiles(
                                                    e.target.files,
                                                )
                                            }
                                        />

                                        {referenceFiles &&
                                        referenceFiles.length > 0 ? (
                                            <div className="p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-sm font-medium text-emerald-700">
                                                        {referenceFiles.length}{' '}
                                                        file(s) selected
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearReferenceFiles();
                                                        }}
                                                    >
                                                        Clear all
                                                    </Button>
                                                </div>
                                                <ul className="space-y-1">
                                                    {Array.from(
                                                        referenceFiles,
                                                    ).map((file, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <FileText className="h-4 w-4 text-emerald-500" />
                                                            <span className="flex-1 truncate text-gray-600">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {(
                                                                    file.size /
                                                                    1024
                                                                ).toFixed(
                                                                    1,
                                                                )}{' '}
                                                                KB
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-8">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                                                    <UploadCloud className="h-6 w-6 text-emerald-500" />
                                                </div>
                                                <p className="mt-2 text-sm font-medium text-gray-700">
                                                    Click to upload reference
                                                    files
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    PDF, DOCX, XLSX (Max 10MB
                                                    each)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Templates Section */}
                            <div className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                                        <FileUp className="h-3.5 w-3.5 text-amber-600" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Report Templates
                                    </h3>
                                </div>

                                <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm">
                                    <div className="mb-3 flex items-center justify-between">
                                        <Label className="text-sm font-medium text-amber-900">
                                            Upload Template Files
                                        </Label>
                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                            Optional
                                        </span>
                                    </div>

                                    <div
                                        className={cn(
                                            'relative cursor-pointer rounded-lg border-2 border-dashed transition-all',
                                            templateFiles
                                                ? 'border-amber-300 bg-amber-50/50'
                                                : 'border-amber-200 bg-white hover:border-amber-300 hover:bg-amber-50/50',
                                        )}
                                        onClick={() =>
                                            templateFileInputRef.current?.click()
                                        }
                                    >
                                        <Input
                                            ref={templateFileInputRef}
                                            type="file"
                                            multiple
                                            name="template_files[]"
                                            className="hidden"
                                            onChange={(e) =>
                                                setTemplateFiles(e.target.files)
                                            }
                                        />

                                        {templateFiles &&
                                        templateFiles.length > 0 ? (
                                            <div className="p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <p className="text-sm font-medium text-amber-700">
                                                        {templateFiles.length}{' '}
                                                        file(s) selected
                                                    </p>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearTemplateFiles();
                                                        }}
                                                    >
                                                        Clear all
                                                    </Button>
                                                </div>
                                                <ul className="space-y-1">
                                                    {Array.from(
                                                        templateFiles,
                                                    ).map((file, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <FileText className="h-4 w-4 text-amber-500" />
                                                            <span className="flex-1 truncate text-gray-600">
                                                                {file.name}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {(
                                                                    file.size /
                                                                    1024
                                                                ).toFixed(
                                                                    1,
                                                                )}{' '}
                                                                KB
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-8">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                                                    <FileUp className="h-6 w-6 text-amber-500" />
                                                </div>
                                                <p className="mt-2 text-sm font-medium text-gray-700">
                                                    Click to upload template
                                                    files
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    PDF, DOCX, XLSX (Max 10MB
                                                    each)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Schema (Hidden) */}
                            <Input
                                hidden
                                name="form_schema"
                                value={JSON.stringify(fields)}
                                readOnly
                            />

                            {/* Error Summary */}
                            {Object.keys(errors).length > 0 && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800">
                                                Please fix the following errors:
                                            </p>
                                            <ul className="mt-1 list-inside list-disc text-sm text-red-700">
                                                {Object.entries(errors).map(
                                                    ([key, value]) => (
                                                        <li key={key}>
                                                            {value}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 -mx-6 border-t bg-white px-6 py-4">
                                <div className="flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        className="px-6"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px] bg-blue-600 px-6 hover:bg-blue-700"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Creating...
                                            </div>
                                        ) : (
                                            'Create Report'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
