import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * Returns a stable function identity that wraps the given `callback`. However,
 * the stable function must not be called during render. It is intended to be
 * called in `useEffect`s and event handlers.
 *
 * To indicate that a value's identity is stable, I suggest suffixing stable
 * values with a `_s`. This way, you may fearlessly reference the stable
 * callback in hook dependencies and to memoized components.
 */
export function useStableCallback<F extends Function>(callback: F): F {
  const callbackRef = useRef(callback);

  // `useLayoutEffect` runs synchronously, and while allegedly "slow" should
  // probably be fine if it's just updating a ref
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: unknown[]) => callbackRef.current(...args)) as Function as F,
    []
  );
}
