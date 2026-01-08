import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import { FlashToaster } from '@/components/flash-toaster';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { Program, User, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Eye, EyeClosed, Folders } from 'lucide-react';
import { Activity, useState } from 'react';
import EllipsisVerticalCard from './components/ellipsis-vertival';
import EmptyProgram from './components/empty-programs';
import ProgramDialog from './components/program-dialog';
import ReviewProgram from './components/review';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: dashboard().url,
    },
];

export default function Programs() {
    const [open, setOpen] = useState<boolean>(false);
    const [selectReviewProgram, setSelecReviewProgram] =
        useState<Program | null>();
    const [reviewOpen, setReviewOpen] = useState<boolean>(true);

    const { programs } = usePage<{ programs: Program[] }>().props;

    const { coordinators } = usePage<{
        coordinators: Pick<User, 'id' | 'name' | 'email' | 'avatar'>[];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Programs" />

            <FlashToaster />

            <div
                className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl"
                onClick={(e) => {
                    if (e.target === e.currentTarget)
                        setSelecReviewProgram(null);
                }}
            >
                <div className="mt-4 flex justify-end gap-2 px-4">
                    <ProgramDialog
                        coordinators={coordinators}
                        open={open}
                        setOpen={setOpen}
                    />
                    <Button
                        onClick={() => {
                            setReviewOpen((prev) => !prev);
                        }}
                        variant={'outline'}
                    >
                        {reviewOpen ? <EyeClosed /> : <Eye />}
                        {reviewOpen ? 'Hide' : 'Show'} Preview
                    </Button>
                </div>

                <div
                    className="relative h-full overflow-hidden border-t p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setSelecReviewProgram(null);
                    }}
                >
                    <div
                        className={cn(
                            'space-x-3 transition-all duration-300 ease-in-out',
                            reviewOpen ? 'mr-[350px]' : 'mr-0',
                        )}
                    >
                        <h1 className="mb-3 font-semibold">All Programs</h1>
                        <Activity
                            mode={programs.length === 0 ? 'visible' : 'hidden'}
                        >
                            <EmptyProgram setIsOpen={setOpen} />
                        </Activity>

                        <Activity
                            mode={programs.length > 0 ? 'visible' : 'hidden'}
                        >
                            <div className="grid grid-cols-3 gap-5">
                                {programs.map((program, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSelecReviewProgram(program);
                                        }}
                                        onDoubleClick={() => {
                                            router.visit(
                                                ViewController.reports(program),
                                            );
                                        }}
                                        className={cn(
                                            'flex cursor-pointer items-center justify-start gap-5 rounded-sm border bg-background/50 px-4 py-2 transition-colors',
                                            program.id ===
                                                selectReviewProgram?.id
                                                ? 'border-primary/50 bg-muted'
                                                : 'hover:bg-muted/50',
                                        )}
                                    >
                                        <div>
                                            <Folders className="" />
                                        </div>
                                        <div className="flex w-full items-center justify-between text-left">
                                            <div>
                                                <h2 className="">
                                                    {program.name}
                                                </h2>
                                            </div>
                                            <div>
                                                <EllipsisVerticalCard
                                                    program={program}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Activity>
                    </div>

                    {/* Review Panel with Slide Transition */}
                    <div
                        className={cn(
                            'absolute top-0 right-0 h-full w-[350px] border-l bg-background transition-transform duration-300 ease-in-out',
                            reviewOpen ? 'translate-x-0' : 'translate-x-full',
                        )}
                    >
                        <ReviewProgram program={selectReviewProgram} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
