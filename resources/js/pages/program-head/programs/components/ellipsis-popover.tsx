import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Program } from '@/types';
import { Link } from '@inertiajs/react';
import { EllipsisVertical, ExternalLink, Pencil } from 'lucide-react';
import { useState } from 'react';
import DeleteProgramDialog from './delete-dialog';

export default function EllipsisPopover({ program }: { program: Program }) {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent className='flex flex-col w-40'>
                <div className=''>
                    <Link className="flex items-center justify-between gap-3 transition-all duration-300 hover:bg-muted rounded px-1 py-2.5">
                        <span>Open</span>
                        <ExternalLink className="h-4 w-4" />
                    </Link>
                </div>
                <div>
                    <Link className="flex items-center justify-between gap-3 transition-all duration-300 hover:bg-muted rounded px-1 py-2.5">
                        <span>Edit</span>
                        <Pencil className="h-4 w-4" />
                    </Link>
                </div>
                <div className='hover:bg-destructive/10 rounded px-1 py-2.5'>
                    <DeleteProgramDialog
                        program={program}
                        setOpenPop={setOpen}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
