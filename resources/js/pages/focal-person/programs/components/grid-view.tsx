import ViewController from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import { Program } from '@/types';
import { Link } from '@inertiajs/react';
import { EllipsisVertical, Folder } from 'lucide-react';

export default function GridView({ programs }: { programs: Program[] }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {programs.map((program) => (
                <Link key={program.id} href={ViewController.reports(program)}>
                    <div className="group flex items-start gap-3 rounded-xl border bg-background/50 px-3 py-3 transition-colors hover:bg-background/80 sm:items-center sm:gap-5 sm:px-4 sm:py-2">
                        <div className="mt-1 flex-shrink-0 sm:mt-0">
                            <Folder className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground sm:h-6 sm:w-6" />
                        </div>
                        <div className="flex w-full min-w-0 items-start justify-between gap-2 sm:items-center">
                            <div className="min-w-0 flex-1">
                                <h2 className="truncate text-base font-semibold sm:text-lg">
                                    {program.name}
                                </h2>
                                <p className="line-clamp-2 text-xs text-muted-foreground sm:line-clamp-1 sm:text-sm">
                                    {program.description}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <EllipsisVertical className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
