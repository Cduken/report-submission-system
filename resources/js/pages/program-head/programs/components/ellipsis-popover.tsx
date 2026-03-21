import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Program, User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { EllipsisVertical, ExternalLink, Pencil } from 'lucide-react';
import { useState } from 'react';
import DeleteProgramDialog from './delete-dialog';
import EditProgramDialog from './edit-dialog';

export default function EllipsisPopover({ program }: { program: Program }) {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const { coordinators } = usePage<{
        coordinators: Pick<User, 'id' | 'name' | 'email' | 'avatar'>[];
    }>().props;

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        className="rounded-md p-1.5 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-muted-foreground dark:hover:bg-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EllipsisVertical className="h-4 w-4" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-44 p-1"
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Open */}
                    <button
                        onClick={() => {
                            setOpen(false);
                            router.visit(ViewController.reports(program));
                        }}
                        className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted dark:hover:bg-gray-700"
                    >
                        <span>Open</span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    {/* Edit */}
                    <button
                        onClick={() => {
                            setOpen(false);
                            setEditOpen(true);
                        }}
                        className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted dark:hover:bg-gray-700"
                    >
                        <span>Edit</span>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>

                    <div className="my-1 border-t dark:border-gray-700" />

                    {/* Delete */}
                    <div className="rounded-md hover:bg-destructive/10">
                        <DeleteProgramDialog
                            program={program}
                            setOpenPop={setOpen}
                        />
                    </div>
                </PopoverContent>
            </Popover>

            <EditProgramDialog
                program={program}
                coordinators={coordinators}
                open={editOpen}
                setOpen={setEditOpen}
            />
        </>
    );
}
