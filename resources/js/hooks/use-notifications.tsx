import axios from 'axios';
import { useCallback } from 'react';

export function useNotifications() {
    const markAsRead = useCallback(async (id: string) => {
        await axios.patch(`/notifications/${id}/read`);
    }, []);

    const markAllAsRead = useCallback(async () => {
        console.log('All goods');
        await axios.patch('/notifications/read-all');
    }, []);

    const remove = useCallback(async (id: string) => {
        await axios.delete(`/notifications/${id}`);
    }, []);

    const removeAll = useCallback(async (id: string) => {
        await axios.delete('/notifications');
    }, []);

    return { markAsRead, markAllAsRead, remove, removeAll };
}
