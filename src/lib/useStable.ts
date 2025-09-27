import { RefObject, useCallback, useLayoutEffect, useRef } from "react";

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

  // Catch when callback is called during render
  let isRenderingRef: RefObject<boolean> | undefined;
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    isRenderingRef = useRef(false);
    isRenderingRef.current = true;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
      if (isRenderingRef) {
        isRenderingRef.current = false;
      }
    });
  }

  return useCallback(
    ((...args: unknown[]) => {
      if (process.env.NODE_ENV !== "production" && isRenderingRef?.current) {
        throw new Error("Stable callbacks cannot be called during render.");
      }
      return callbackRef.current(...args);
    }) as Function as F,
    [isRenderingRef]
  );
}
