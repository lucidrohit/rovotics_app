import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

export default function useDebouncedState<T>(initialState: T, delay: number = 2) {
    const [state, setState] = useState(initialState);
    const debouncedSetState = debounce(setState, delay);

    useEffect(() => {
        return () => {
            debouncedSetState.cancel();
        };
    }, [debouncedSetState]);

    return [state, debouncedSetState] as const;
}
