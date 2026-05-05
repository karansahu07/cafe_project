import { useState, useEffect } from 'react';

/**
 * A custom hook that creates a debounced version of a value.
 * @param {any} value - The value to be debounced
 * @param {number} delay - The delay in milliseconds (default: 3000ms)
 * @returns {any} - The debounced value
 */
const useDebounce = (value, delay = 3000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes or the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;