import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import AddUserDialog from './add-user-dialog';
import DeleteMultipleDialog from './delete-multiple-dialog';

export default function Header({
    selectedUsers,
}: {
    selectedUsers: Set<number>;
}) {
    const users_id = Array.from(selectedUsers);

    console.log({ users_id });
    return (
        <div className="lg:flex items-center justify-between">
            <h1 className="lg:text-lg mb-1 lg:mb-0 font-semibold">All Users</h1>
            <div className="flex items-center gap-1 lg:gap-3">
                {/* Search Bar */}
                <div className="flex items-center gap-2 rounded-lg border px-2 py-2 flex-1">
                    <Search size={15} />
                    <input
                        placeholder="Search..."
                        className="flex-1 bg-transparent text-sm outline-none w-10 lg:w-auto"
                    />
                </div>
                {/* filter */}
                <Button variant={'outline'}>
                    <Filter />
                    Filter
                </Button>
                {/* Delete Selected Users */}
                <DeleteMultipleDialog users_id={users_id} />
                {/* Add new Users */}
                <AddUserDialog />
            </div>
        </div>
    );
}
