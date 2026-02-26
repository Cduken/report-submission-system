import ProgramController from '@/actions/App/Http/Controllers/ProgramController';
import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Program } from '@/types';
import { Form, Link } from '@inertiajs/react';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';

export default function EllipsisVerticalCard({
    program,
}: {
    program: Program;
}) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <HoverCard open={open} onOpenChange={setOpen}>
            <HoverCardTrigger asChild>
                <button onClick={() => setOpen(true)}>
                    <EllipsisVertical className="transition-colors hover:text-muted-foreground" />
                </button>
            </HoverCardTrigger>
            <HoverCardContent>
                <data
                    className='flex flex-col gap-2'
                    value="">
                    <div className='action p-2 hover:bg-accent hover:text-accent-foreground rounded transition-all duration-300 hover:cursor-pointer'>
                        <Link>Open</Link>
                    </div>
                    <div className='action p-2 hover:bg-accent hover:text-accent-foreground rounded transition-all duration-300 hover:cursor-pointer'>
                        <Link>Edit</Link>
                    </div>
                    <div>
                        <Form
                            {...ProgramController.destroy.form(program)}
                            onSuccess={() => {
                                setOpen(false);
                            }}
                        >
                            <Button
                                type="submit"
                                variant={'destructive'}
                                className='transition-all duration-300 hover:cursor-pointer'
                            >
                                Delete
                            </Button>
                        </Form>
                    </div>
                </data>
            </HoverCardContent>
        </HoverCard>
    );
}
