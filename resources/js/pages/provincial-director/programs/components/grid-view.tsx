import { Program } from '@/types';
import { Calendar,
    EllipsisVertical,
    Folders,
    ExternalLink,
    Share2,
    Pencil,
    Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function GridView({ programs }: { programs: Program[] }) {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [selectReviewProgram, setSelectReviewProgram] = useState<Program | null>(null);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => {
                const isSelected = program.id === selectReviewProgram?.id;

                return (
                    <div
                        key={program.id}
                        onClick={() => setSelectReviewProgram(program)}
                        className={cn(
                            'group relative flex cursor-pointer flex-col justify-between rounded-2xl p-5 transition-all duration-300',
                            'bg-white shadow-sm hover:-translate-y-1 hover:shadow-md dark:bg-[#1d1818]',
                            isSelected
                                ? 'border-primary ring-1 ring-primary/30 bg-primary/[0.03] dark:bg-primary/[0.08]'
                                : 'border-slate-200/60 dark:border-gray-800'
                        )}
                    >
                        {/* Top Section */}
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                {/* FIX: Folder Icon - used primary-foreground for selection visibility */}
                                <div className={cn(
                                    "rounded-xl p-2.5 transition-colors",
                                    isSelected
                                        ? "bg-primary text-white dark:text-slate-900"
                                        : "bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-400"
                                )}>
                                    <Folders className="h-5 w-5" />
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenu(activeMenu === program.id ? null : program.id);
                                        }}
                                        className={cn(
                                            "rounded-full p-1.5 transition-all hover:bg-slate-100 dark:hover:bg-gray-800",
                                            "opacity-40 group-hover:opacity-100 dark:opacity-50 dark:text-gray-300"
                                        )}
                                    >
                                        <EllipsisVertical className="h-4 w-4" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {activeMenu === program.id && (
                                        <>
                                            {/* Backdrop to close menu */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}
                                            />

                                            {/* Dropdown Container */}
                                            <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-0 dark:bg-[#0a0a0a] dark:opacity-100">
                                                {[
                                                    { label: 'Open', icon: ExternalLink },
                                                    { label: 'Share', icon: Share2 },
                                                    { label: 'Rename', icon: Pencil },
                                                ].map((action) => (
                                                    <button
                                                        key={action.label}
                                                        className="group/item flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-gray-800"
                                                    >
                                                        <span className="truncate">{action.label}</span>
                                                        <action.icon className="h-4 w-4 opacity-40 group-hover/item:opacity-100 transition-opacity dark:text-gray-400 dark:group-hover/item:text-primary" />
                                                    </button>
                                                ))}

                                                <div className="my-1 border-t border-slate-100 dark:border-gray-800" />

                                                <button className="group/item flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30">
                                                    <span>Delete</span>
                                                    <Trash2 className="h-4 w-4 opacity-60 group-hover/item:opacity-100 transition-opacity" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                                    {program.name}
                                </h2>
                                {program.description && (
                                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                        {program.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-gray-800">
                            {program.coordinator ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-400">
                                        {getInitials(program.coordinator.name)}
                                    </div>
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {program.coordinator.name}
                                    </span>
                                </div>
                            ) : <div />}

                            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(program.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
