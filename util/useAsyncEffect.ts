import { useEffect } from "react";

export function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  inputs?: ReadonlyArray<unknown>
): void {
  useEffect(() => {
    const promise = effect();
    return async () => {
      const cleanup = await promise;
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, inputs);
}
