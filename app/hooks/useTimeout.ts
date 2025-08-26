import {useEffect, useRef, useState} from 'react';

const useTimeout = (delay: number, trigger?: unknown): boolean => {
  const [complete, setComplete] = useState(false);

  const timeoutRef = useRef(0);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setComplete(false);
    timeoutRef.current = window.setTimeout(() => {
      setComplete(true);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, trigger]);

  return complete;
};

export default useTimeout;
