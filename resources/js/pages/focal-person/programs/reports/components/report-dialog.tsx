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
import { Program } from '@/types';
import { Form } from '@inertiajs/react';
import {
    Download,
    FileText,
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

// Fixed type to 'file' only
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
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex justify-end">
                    <Button type="button" variant={'secondary'}>
                        <Folder className="mr-2 h-4 w-4" />
                        <span>Create New Report</span>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Report</DialogTitle>
                    <DialogDescription>
                        Define the report details and upload any templates for
                        the officers.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ReportController.store.form()}
                    onSuccess={() => {
                        setOpen(false);
                        setFields([]);
                        setTemplateFiles(null);
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-6">
                            <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
                                <div>
                                    <Label htmlFor="title">Report Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g. Q1 Compliance Report"
                                        className="bg-white"
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                <div>
                                    <Label htmlFor="description">
                                        Report Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Instructions for the officers..."
                                        className="bg-white"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Hidden Program ID */}
                                <Input
                                    hidden
                                    name="program_id"
                                    value={program.id}
                                    readOnly
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="deadline">
                                            Deadline
                                        </Label>
                                        <Input
                                            type="date"
                                            name="deadline"
                                            id="deadline"
                                            className="bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="final_deadline">
                                            Final Deadline
                                        </Label>
                                        <Input
                                            type="date"
                                            name="final_deadline"
                                            id="final_deadline"
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-blue-900">
                                        <Download className="h-4 w-4" />
                                        Upload Templates (Optional)
                                    </Label>
                                    <span className="text-xs text-blue-600">
                                        Visible to officers
                                    </span>
                                </div>

                                <div
                                    className="relative flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-blue-300 bg-white p-4 transition-colors hover:bg-blue-50"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        name="template_files[]"
                                        className="hidden"
                                        onChange={(e) =>
                                            setTemplateFiles(e.target.files)
                                        }
                                    />

                                    <UploadCloud className="mb-2 h-8 w-8 text-blue-400" />

                                    {templateFiles &&
                                    templateFiles.length > 0 ? (
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-blue-700">
                                                {templateFiles.length} file(s)
                                                selected
                                            </p>
                                            <ul className="mt-1 text-xs text-gray-500">
                                                {Array.from(templateFiles).map(
                                                    (file, i) => (
                                                        <li
                                                            key={i}
                                                            className="mx-auto max-w-[200px] truncate"
                                                        >
                                                            {file.name}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-600">
                                                Click to upload files
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                PDF, DOCX, XLSX supported
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="mb-4 flex items-end justify-between border-b pb-2">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Required Attachments
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            List the files officers must upload
                                            back to you.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addField}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs"
                                    >
                                        <Plus className="mr-2 h-3.5 w-3.5" />
                                        Add File Slot
                                    </Button>
                                </div>

                                {/* Visual List of Fields */}
                                <div className="space-y-3">
                                    {fields.length === 0 && (
                                        <div className="flex h-20 flex-col items-center justify-center rounded-md border border-dashed bg-gray-50 text-sm text-gray-400 italic">
                                            No attachments requested yet.
                                        </div>
                                    )}

                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="group flex items-center gap-3 rounded-md border bg-white p-2 px-3 shadow-sm transition-all hover:border-gray-300"
                                        >
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-600">
                                                <FileText className="h-4 w-4" />
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <Label className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
                                                    Attachment Name #{index + 1}
                                                </Label>
                                                <Input
                                                    value={field.label}
                                                    onChange={(e) =>
                                                        updateLabel(
                                                            field.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. Scanned Attendance Sheet"
                                                    className="h-8 border-none bg-transparent p-0 text-sm font-medium shadow-none placeholder:text-gray-300 focus-visible:ring-0"
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
                                                onClick={() =>
                                                    removeField(field.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <input
                                type="hidden"
                                name="form_schema"
                                value={JSON.stringify(fields)}
                            />

                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Report'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
