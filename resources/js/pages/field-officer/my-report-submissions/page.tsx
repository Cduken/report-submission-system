import AppLayout from '@/layouts/app-layout';

import { WhenVisible } from '@inertiajs/react';
import { breadcrumbs } from '../dashboard/page';
import Header from './components/header';
import Submissions from './submissions';

export default function MyReports() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Header />

                <WhenVisible
                    data={'mySubmissions'}
                    fallback={() => <div>Loading...</div>}
                >
                    <Submissions />
                </WhenVisible>
            </div>
        </AppLayout>
    );
}
