import AppLayout from '@/layouts/app-layout';
import { breadcrumbs } from '@/pages/field-officer/dashboard/page';
import { User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import UserProfile from './components/profile-card';

export default function ViewUser() {
    const { user } = usePage<{ user: User }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User Management - ${user.name}`}/>
            <div className='p-4 flex flex-col gap-4'>
                <h1 className="text-xl font-semibold">User Information</h1>

                <UserProfile user={user} />
            </div>
        </AppLayout>
    );
}
