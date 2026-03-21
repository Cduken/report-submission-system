import ProgramController from '@/actions/App/Http/Controllers/ProgramController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Textarea } from '@/components/ui/textarea';
import { Program, User } from '@/types';
import { Form } from '@inertiajs/react';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
    program: Program;
    coordinators: Pick<User, 'id' | 'name' | 'email' | 'avatar'>[];
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditProgramDialog({
    program,
    coordinators,
    open,
    setOpen,
}: Props) {
    const [coordinatorId, setCoordinatorId] = useState(
        String(program.coordinator.id),
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Program</DialogTitle>
                    <DialogDescription>
                        Update the details of this program.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ProgramController.update.form(program.id)}
                    onSuccess={() => setOpen(false)}
                    className="flex flex-col gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Name */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="edit-name">Program Name</Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    defaultValue={program.name}
                                    placeholder="Enter program name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="edit-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    name="description"
                                    defaultValue={program.description ?? ''}
                                    placeholder="Enter program description"
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Coordinator */}
                            <div className="flex flex-col gap-1.5">
                                <Label>Coordinator</Label>
                                <Select
                                    value={coordinatorId}
                                    onValueChange={setCoordinatorId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a coordinator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {coordinators.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* Hidden input so the Form picks up the value on submit */}
                                <input
                                    type="hidden"
                                    name="coordinator_id"
                                    value={coordinatorId}
                                />
                                <InputError message={errors.coordinator_id} />
                            </div>

                            <DialogFooter className="mt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
