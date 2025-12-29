import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type FlashProps = {
    success?: string;
    error?: string;
    flash_time?: number;
};

export function FlashToaster() {
    const { flash = {} } = usePage().props as { flash?: FlashProps };

    useEffect(() => {
        if (flash.success) {
            toast.success('Success', {
                description: flash.success,
                richColors: true,
                duration: 3000,
            });
        }

        if (flash.error) {
            toast.error('Error', {
                description: flash.error,
                richColors: true,
                duration: 3000,
            });
        }
    }, [flash.success, flash.error, flash.flash_time]);

    return null;
}
