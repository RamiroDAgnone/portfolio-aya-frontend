import { useCallback, useMemo, useState } from "react";

export function useImageValidation() {
  const [errors, setErrors] = useState({});

  const registerValidation = useCallback((key, hasError) => {
    setErrors(prev => {
      if (prev[key] === hasError) return prev;
      return {
        ...prev,
        [key]: hasError
      };
    });
  }, []);

  const hasInvalidImages = useMemo(
    () => Object.values(errors).some(Boolean),
    [errors]
  );

  return {
    registerValidation,
    hasInvalidImages
  };
}