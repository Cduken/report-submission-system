import ViewController from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import { cn } from '@/lib/utils';
import { Program } from '@/types';
import { router } from '@inertiajs/react';
import { Folders } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import EllipsisPopover from './ellipsis-popover';

interface Props {
    programs: Program[];
    selectReviewProgram: Program | null | undefined;
    setSelecReviewProgram: Dispatch<SetStateAction<Program | null | undefined>>;
}

export default function GridView({
    programs,
    selectReviewProgram,
    setSelecReviewProgram,
}: Props) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => {
                const isSelected = program.id === selectReviewProgram?.id;

                return (
                    <div
                        key={index}
                        onClick={() => setSelecReviewProgram(program)}
                        onDoubleClick={() =>
                            router.visit(ViewController.reports(program))
                        }
                        className={cn(
                            'group flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all duration-200',
                            isSelected
                                ? 'border-primary/50 bg-muted shadow-sm'
                                : 'border-border bg-card hover:bg-muted/50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900/50',
                        )}
                    >
                        {/* Icon + name + ellipsis */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-muted p-2.5 dark:bg-gray-800">
                                    <Folders className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-medium text-foreground dark:text-white">
                                        {program.name}
                                    </h2>
                                    {program.description && (
                                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground dark:text-gray-400">
                                            {program.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div
                                className="flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <EllipsisPopover program={program} />
                            </div>
                        </div>

                        {/* Coordinator */}
                        {program.coordinator && (
                            <div className="flex items-center gap-2 border-t pt-2 dark:border-gray-700">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground dark:bg-gray-700 dark:text-gray-300">
                                    {program.coordinator.name.charAt(0)}
                                </div>
                                <span className="truncate text-xs text-muted-foreground dark:text-gray-400">
                                    {program.coordinator.name}
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
