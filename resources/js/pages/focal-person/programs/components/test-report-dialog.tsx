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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Program } from '@/types';
import { Form } from '@inertiajs/react'; // Assuming this is your Wayfinder wrapper
import { Folder, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ReportDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    program: Program;
}

// Simple type for our local UI state
type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'file';

interface DynamicField {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
}

export default function TestReportDialog({
    setOpen,
    open,
    program,
}: ReportDialogProps) {
    // 1. Local State to manage the UI of dynamic fields
    const [fields, setFields] = useState<DynamicField[]>([]);

    // Helper: Add a blank field
    const addField = () => {
        setFields([
            ...fields,
            {
                id: crypto.randomUUID(),
                label: '',
                type: 'text',
                required: false,
            },
        ]);
    };

    // Helper: Update a specific field
    const updateField = (id: string, key: keyof DynamicField, value: any) => {
        setFields((prev) =>
            prev.map((field) =>
                field.id === id ? { ...field, [key]: value } : field,
            ),
        );
    };

    // Helper: Remove a field
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
            <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Report</DialogTitle>
                    <DialogDescription>
                        Define the report details and build the form for field
                        officers.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ReportController.store.form()}
                    onSuccess={() => {
                        setOpen(false);
                        setFields([]); // Reset UI on success
                    }}
                    // OPTIONAL: If your Wayfinder supports passing extra data, you'd merge 'fields' here.
                    // data={{ ...defaultData, form_schema: fields }}
                >
                    {({ processing, errors }) => (
                        <div className="space-y-6">
                            {/* --- SECTION 1: STATIC DETAILS --- */}
                            <div className="space-y-3 p-1">
                                <div>
                                    <Label htmlFor="title">Report Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g. Q1 Compliance Report"
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
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* --- SECTION 2: DYNAMIC FIELD BUILDER UI --- */}
                            <div className="border-t pt-4">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Form Builder
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Add the questions that field
                                            officers need to answer.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={addField}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add
                                        Field
                                    </Button>
                                </div>

                                {/* Visual List of Fields */}
                                <div className="min-h-[100px] space-y-3 rounded-md border bg-gray-50/50 p-2">
                                    {fields.length === 0 && (
                                        <div className="flex h-24 flex-col items-center justify-center text-sm text-gray-400 italic">
                                            No fields added yet. Click "Add
                                            Field" to start.
                                        </div>
                                    )}

                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="group flex items-start gap-3 rounded border bg-white p-3 shadow-sm transition-colors hover:border-gray-300"
                                        >
                                            {/* Drag Handle Icon (Visual only) */}
                                            <div className="mt-3 cursor-move text-gray-300">
                                                <GripVertical className="h-4 w-4" />
                                            </div>

                                            <div className="grid flex-1 gap-3">
                                                <div className="grid grid-cols-12 gap-3">
                                                    {/* Field Label */}
                                                    <div className="col-span-6">
                                                        <Label className="text-xs text-gray-500">
                                                            Label / Question
                                                        </Label>
                                                        <Input
                                                            value={field.label}
                                                            onChange={(e) =>
                                                                updateField(
                                                                    field.id,
                                                                    'label',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="e.g. Total Beneficiaries"
                                                            className="h-8 text-sm"
                                                        />
                                                    </div>

                                                    {/* Field Type */}
                                                    <div className="col-span-4">
                                                        <Label className="text-xs text-gray-500">
                                                            Answer Type
                                                        </Label>
                                                        <Select
                                                            value={field.type}
                                                            onValueChange={(
                                                                val,
                                                            ) =>
                                                                updateField(
                                                                    field.id,
                                                                    'type',
                                                                    val,
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="h-8 text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="text">
                                                                    Short Text
                                                                </SelectItem>
                                                                <SelectItem value="textarea">
                                                                    Long Text
                                                                </SelectItem>
                                                                <SelectItem value="number">
                                                                    Number
                                                                </SelectItem>
                                                                <SelectItem value="date">
                                                                    Date
                                                                </SelectItem>
                                                                <SelectItem value="file">
                                                                    File Upload
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Required Toggle */}
                                                    <div className="col-span-2 flex flex-col items-center justify-center pt-4">
                                                        <div className="flex items-center gap-2">
                                                            <Label className="text-[10px] font-bold text-gray-500 uppercase">
                                                                Req?
                                                            </Label>
                                                            <Switch
                                                                checked={
                                                                    field.required
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    updateField(
                                                                        field.id,
                                                                        'required',
                                                                        checked,
                                                                    )
                                                                }
                                                                className="origin-left scale-75"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Delete Button */}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="mt-4 h-8 w-8 text-gray-400 hover:bg-red-50 hover:text-red-600"
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

                            {/* IMPORTANT: Hidden Input to actually submit the JSON data
                                This bridges your UI state to the Form submission */}
                            <input
                                type="hidden"
                                name="form_schema"
                                value={JSON.stringify(fields)}
                            />

                            <div className="mt-4 flex justify-end">
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
