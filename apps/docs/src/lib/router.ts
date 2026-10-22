import { useEffect, useState } from "react";

function currentRoute() {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) {
    return "/";
  }

  return raw.length > 1 ? raw.replace(/\/+$/, "") : raw;
}

export function navigate(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (window.location.hash === `#${normalized}`) {
    return;
  }
  window.location.hash = normalized;
}

export function useHashRoute() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    function onChange() {
      setRoute(currentRoute());
    }

    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}
