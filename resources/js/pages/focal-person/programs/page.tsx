import ToggleGridList from '@/components/toggle-list-grid';
import AppLayout from '@/layouts/app-layout';
import { Program } from '@/types';
import { usePage } from '@inertiajs/react';
import { Activity, useState } from 'react';
import { breadcrumbs } from '../dashboard/page';
import FilterBtn from '../../../components/filter';
import GriddView from './components/grid-view';
import ListView from './components/list-view';

export default function programs() {
    const [isList, setIsLIst] = useState<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const { programs } = usePage<{ programs: Program[] }>().props;

    const filteredPrograms = selectedYear
        ? programs.filter(
              (p) => new Date(p.created_at).getFullYear() === selectedYear,
          )
        : programs;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    {/* <div></div> */}
                    <h1 className="text-center text-xl font-semibold sm:text-2xl">
                        All Programs
                    </h1>
                    <div className="flex items-center gap-3">
                        <FilterBtn onSelect={setSelectedYear} />
                        <ToggleGridList isList={isList} setIsList={setIsLIst} />
                    </div>
                </div>

                <Activity
                    mode={filteredPrograms.length <= 0 ? 'visible' : 'hidden'}
                >
                    <h1 className="text-center text-muted-foreground">
                        No programs yet
                    </h1>
                </Activity>

                <Activity
                    mode={filteredPrograms.length > 0 ? 'visible' : 'hidden'}
                >
                    {isList ? (
                        <ListView programs={filteredPrograms} />
                    ) : (
                        <GriddView programs={filteredPrograms} />
                    )}
                </Activity>
            </div>
        </AppLayout>
    );
}
