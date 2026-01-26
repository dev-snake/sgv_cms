import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value.
 * @param value value to be debounced
 * @param delay delay in milliseconds (default 500ms)
 * @returns debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
