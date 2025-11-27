import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useIdleTimeout(timeoutInSeconds: number = 10) {
    const router = useRouter();
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    const resetTimer = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        timeoutId.current = setTimeout(() => {
            logout();
        }, timeoutInSeconds * 1000);
    };

    useEffect(() => {
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click',
        ];

        const handleActivity = () => {
            resetTimer();
        };
        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        resetTimer();

        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [timeoutInSeconds]);
}
