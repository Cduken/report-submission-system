import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { User } from '@/types';
import { Form } from '@inertiajs/react';
import { Upload, User as UserIcon } from 'lucide-react';
import { useRef, useState } from 'react';

type pageProps = {
    user: User;
    closeDialog: () => void;
};

export default function EditProfileForm({ user, closeDialog }: pageProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const roles = [
        { value: 'field_officer', label: 'Field Officer' },
        { value: 'focal_person', label: 'Focal Person' },
    ];

    const genders = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
    ];

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <Form
            {...UserController.store.form()}
            onSuccess={() => {
                closeDialog();
            }}
            className="space-y-8 pb-8"
        >
            {({ processing, errors }) => (
                <>
                    {/* Avatar Section */}
                    <div className="flex items-start gap-6 rounded-lg border bg-card p-6">
                        <div className="flex flex-col items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/25 bg-muted/50"
                            >
                                {previewUrl || user.avatar ? (
                                    <img
                                        src={previewUrl ?? user.avatar}
                                        alt="Avatar preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserIcon size={32} />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100">
                                    <Upload size={20} className="text-white" />
                                </div>
                            </button>

                            <Input
                                ref={fileInputRef}
                                name="avatar"
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <InputError message={errors.avatar} />
                        </div>

                        <div className="flex-1">
                            <Label className="text-base font-semibold">
                                Profile Picture
                            </Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Update your profile picture. Accepted formats: PNG, JPG, JPEG
                            </p>
                            <div className="mt-4">
                                <Label htmlFor="employee_code">
                                    Employee Code
                                </Label>
                                <Input
                                    id="employee_code"
                                    name="employee_code"
                                    defaultValue={user.employee_code}
                                    className="mt-1.5 max-w-xs"
                                />
                                <InputError message={errors.employee_code} />
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Personal */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className='mb-4'>
                                <h3 className="font-semibold">
                                    Personal Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Basic personal details
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="first_name">
                                    First Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    name="first_name"
                                    placeholder="First Name"
                                    defaultValue={user.first_name}
                                    required
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="middle_name">Middle Name</Label>
                                <Input
                                    name="middle_name"
                                    placeholder="Middle Name"
                                    defaultValue={user.middle_name}
                                />
                                <InputError message={errors.middle_name} />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="last_name">
                                    Last Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    name="last_name"
                                    placeholder="Last Name"
                                    defaultValue={user.last_name}
                                    required
                                />
                                <InputError message={errors.last_name} />
                            </div>

                            <Select name="gender" defaultValue={user.gender}>
                                <Label htmlFor="gender">
                                    Gender{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    {genders.map((gender) => (
                                        <SelectItem
                                            key={gender.value}
                                            value={gender.value}
                                        >
                                            {gender.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} />

                            <div className='space-y-2'>
                                <Label htmlFor="birthday">Birthday</Label>
                                <Input
                                    name="birthday"
                                    type="date"
                                    defaultValue={user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : ''}
                                />
                                <InputError message={errors.birthday} />
                            </div>

                        </div>

                        {/* Work */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className='mb-4'>
                                <h3 className="font-semibold">
                                    Work Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Job and department details
                                </p>
                            </div>

                            <div  className="space-y-2">
                                <Label htmlFor="department">
                                    Department{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    name="department"
                                    defaultValue={user.department}
                                    required
                                />
                                <InputError message={errors.department} />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="position">
                                    Position{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    name="position"
                                    defaultValue={user.position}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cluster">
                                    Cluster
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select name="cluster" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select cluster" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={'M&M'}>
                                            M&M
                                        </SelectItem>
                                        <SelectItem value={"D'ONE"}>
                                            D'ONE
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Select name="role" defaultValue={user.role}>
                                <Label htmlFor="role">
                                    System Role{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.value}
                                            value={role.value}
                                        >
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        {/* Account */}
                        <div className="space-y-4 rounded-lg border bg-card p-6">
                            <div className='mb-4'>
                                <h3 className="font-semibold">
                                    Account Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Login credentials
                                </p>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="email">
                                    Email{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    name="email"
                                    type="email"
                                    defaultValue={user.email}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="password">
                                    Password{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor="password_confirmation">
                                    Confirm Password{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    name="password_confirmation"
                                    type="password"
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeDialog}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            {processing ? 'Updating...' : 'Update User'}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
