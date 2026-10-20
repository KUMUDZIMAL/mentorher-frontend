"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

/**
 * Shows the global full-page loader as soon as the user clicks an internal
 * link, and hides it once the route has actually changed (or after a safety
 * timeout). Without this, the old page stays visible while the new one
 * compiles/loads and it looks like the app is hung.
 */
const RouteLoader = () => {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/") || anchor.target === "_blank") return;
      const dest = href.split("#")[0].split("?")[0];
      if (dest && dest !== pathname) setNavigating(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  useEffect(() => {
    if (!navigating) return;
    const timer = setTimeout(() => setNavigating(false), 8000);
    return () => clearTimeout(timer);
  }, [navigating]);

  if (!navigating) return null;
  return <Loader fullPage size="lg" label="Loading..." />;
};

export default RouteLoader;
