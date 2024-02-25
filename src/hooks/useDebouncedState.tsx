import { useEffect, useState } from 'react';
import { debounce, throttle } from 'lodash';

export default function useDebouncedState<T>(initialState: T, delay: number = 200) {
    const [state, setState] = useState(initialState);
    const debouncedSetState = throttle(setState, delay);

    useEffect(() => {
        return () => {
            debouncedSetState.cancel();
        };
    }, [debouncedSetState]);

    return [state, debouncedSetState] as const;
}
