import { useState, useRef } from 'react';

function useController(val: string) {
    const [value, setValue] = useState(val);
    const ref = useRef<string | null>(null);

    ref.current = '1';

    return [value, setValue] as [typeof value, typeof setValue];
}

export default useController;