// src/hooks/useIsMobile.ts
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const getIsMobile = () => window.innerWidth < MOBILE_BREAKPOINT;

  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return getIsMobile();
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const update = () => setIsMobile(getIsMobile());

    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", update);
    } else {
      // Safari fallback
      mql.addListener(update);
    }

    // Run once to sync
    update();

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", update);
      } else {
        mql.removeListener(update);
      }
    };
  }, []);

  return isMobile;
}
