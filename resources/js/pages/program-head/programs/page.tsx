import FilterBtn from '@/components/filter';
import { FlashToaster } from '@/components/flash-toaster';
import ProgramGridSkeleton from '@/components/skeleton-loader';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { Program, User, type BreadcrumbItem } from '@/types';
import { Deferred, Head, usePage, useRemember } from '@inertiajs/react';
import { Eye, EyeClosed } from 'lucide-react';
import { Activity, useState } from 'react';
import ToggleGridList from '../../../components/toggle-list-grid';
import EmptyProgram from './components/empty-programs';
import GridView from './components/grid';
import ListView from './components/list';
import ProgramDialog from './components/program-dialog';
import ReviewProgram from './components/review';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Programs',
        href: dashboard().url,
    },
];

export default function ProgramsPage() {
    const [open, setOpen] = useState<boolean>(false);
    const [isList, setIsList] = useRemember<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const [selectReviewProgram, setSelecReviewProgram] =
        useState<Program | null>();
    const [reviewOpen, setReviewOpen] = useState<boolean>(true);

    const { programs } = usePage<{ programs: Program[] }>().props;

    const { coordinators } = usePage<{
        coordinators: Pick<User, 'id' | 'name' | 'email' | 'avatar'>[];
    }>().props;

    const filteredPrograms = selectedYear
        ? programs.filter(
              (p) => new Date(p.created_at).getFullYear() === selectedYear,
          )
        : programs;

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
                    <FilterBtn onSelect={setSelectedYear} />
                    <ToggleGridList isList={isList} setIsList={setIsList} />
                </div>

                <div
                    className="relative h-full overflow-hidden border-t p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setSelecReviewProgram(null);
                    }}
                >
                    <Deferred
                        data={'programs'}
                        fallback={<ProgramGridSkeleton />}
                    >
                        <ScrollArea className="relative h-[600px] w-full">
                            <div
                                className={cn(
                                    'space-x-3 transition-all duration-300 ease-in-out',
                                    reviewOpen ? 'mr-[350px]' : 'mr-0',
                                )}
                            >
                                <div className="">
                                    <h1 className="mb-3 font-semibold">
                                        All Programs
                                    </h1>
                                </div>
                                <div>
                                    <Activity
                                        mode={
                                            programs?.length === 0
                                                ? 'visible'
                                                : 'hidden'
                                        }
                                    >
                                        <EmptyProgram setIsOpen={setOpen} />
                                    </Activity>

                                    <Activity
                                        mode={
                                            programs?.length > 0
                                                ? 'visible'
                                                : 'hidden'
                                        }
                                    >
                                        {isList ? (
                                            <ListView
                                                programs={filteredPrograms}
                                                selectReviewProgram={
                                                    selectReviewProgram
                                                }
                                                setSelecReviewProgram={
                                                    setSelecReviewProgram
                                                }
                                            />
                                        ) : (
                                            <GridView
                                                programs={filteredPrograms}
                                                selectReviewProgram={
                                                    selectReviewProgram
                                                }
                                                setSelecReviewProgram={
                                                    setSelecReviewProgram
                                                }
                                            />
                                        )}
                                    </Activity>
                                </div>
                            </div>
                        </ScrollArea>
                    </Deferred>

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
