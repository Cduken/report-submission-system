import FieldOfficerNavigationPath from '@/actions/App/Http/Controllers/FieldOfficer/ViewController';
import FocalPersonNavigationPath from '@/actions/App/Http/Controllers/FocalPerson/ViewController';
import ProgramHeadNavigationPath from '@/actions/App/Http/Controllers/ProgramHead/ViewController';
import ProvincialDirectorNavigationPath from '@/actions/App/Http/Controllers/ProvincialDirector/ViewController';
import { NavItem } from '@/types';
import { Bell, File, FileCheck, Layers, LayoutGrid, Users } from 'lucide-react';

export function mainNavigationPath(role: string): NavItem[] {
    switch (role) {
        case 'field_officer':
            return [
                {
                    title: 'Dashboard',
                    href: FieldOfficerNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Programs',
                    href: FieldOfficerNavigationPath.programs().url,
                    icon: Layers,
                },

                {
                    title: 'My Report Submissions',
                    href: FieldOfficerNavigationPath.myReportSubmissions().url,
                    icon: FileCheck,
                },

                {
                    title: 'Notifications',
                    href: FieldOfficerNavigationPath.notifications().url,
                    icon: Bell,
                },
            ];

        case 'focal_person':
            return [
                {
                    title: 'Dashboard',
                    href: FocalPersonNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Programs',
                    href: FocalPersonNavigationPath.programs().url,
                    icon: File,
                },
                {
                    title: 'Notifications',
                    href: FocalPersonNavigationPath.notifications().url,
                    icon: Bell,
                },
            ];
        case 'program_head':
            return [
                {
                    title: 'Dashboard',
                    href: ProgramHeadNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Programs',
                    href: ProgramHeadNavigationPath.programs().url,
                    icon: Layers,
                },
                {
                    title: 'User management',
                    href: ProgramHeadNavigationPath.manageUsers().url,
                    icon: Users,
                },
                {
                    title: 'Notifications',
                    href: ProgramHeadNavigationPath.notifications().url,
                    icon: Bell,
                },
            ];

        case 'provincial_director':
            return [
                {
                    title: 'Dashboard',
                    href: ProvincialDirectorNavigationPath.dashboard().url,
                    icon: LayoutGrid,
                },
                {
                    title: 'Programs',
                    href: ProvincialDirectorNavigationPath.programs().url,
                    icon: Layers,
                },
            ];
        default:
            return [];
    }
}
