import ToggleGridList from '@/components/toggle-list-grid';
import AppLayout from '@/layouts/app-layout';
import { Program } from '@/types';
import { usePage } from '@inertiajs/react';
import { Activity, useState } from 'react';
import { breadcrumbs } from '../dashboard/page';
import GriddView from './components/grid-view';
import ListView from './components/list-view';

interface Report {
    title: string;
    deadline: Date;
    final_deadline: Date;
}

export default function programs() {
    const [open, setOpen] = useState<boolean>(false);
    const [isList, setIsLIst] = useState<boolean>(false);

    const { programs } = usePage<{ programs: Program[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    {/* <div></div> */}
                    <h1 className="text-center text-xl font-semibold sm:text-2xl">
                        All Programs
                    </h1>
                    <ToggleGridList isList={isList} setIsList={setIsLIst} />
                </div>

                <Activity mode={programs.length <= 0 ? 'visible' : 'hidden'}>
                    <h1 className="text-center text-muted-foreground">
                        No programs yet
                    </h1>
                </Activity>

                <Activity mode={programs.length > 0 ? 'visible' : 'hidden'}>
                    {isList ? (
                        <ListView programs={programs} />
                    ) : (
                        <GriddView programs={programs} />
                    )}
                </Activity>
            </div>
        </AppLayout>
    );
}
