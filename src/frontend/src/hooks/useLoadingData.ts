import { useEffect, useState } from "react";

export function useLoadingData<T>(
  data: T,
  delay = 600,
): { data: T; loading: boolean } {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return { data, loading };
}
