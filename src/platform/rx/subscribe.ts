import { ON_CHANGE } from "./symbol.ts";

export interface ViewModelLifecycle {
  onInit?(): any | Promise<any>;
  onDestroy?(): any | Promise<any>;
}

export function subscribe(
  target: EventTarget & ViewModelLifecycle,
  callback: () => any | Promise<any>,
): () => void {
  target.addEventListener("change", callback);
  const extras = new Set<EventTarget>();

  for (const value of Object.values(
    (target as Record<string | symbol, any>)?.[ON_CHANGE],
  ) || []) {
    if (!(value instanceof EventTarget)) {
      continue;
    }
    extras.add(value);
    value.addEventListener("change", callback);
  }

  target.onInit && target.onInit();

  return () => {
    target.removeEventListener("change", callback);
    for (const extra of extras.values()) {
      extra.removeEventListener("change", callback);
    }
    if (target.onDestroy) target.onDestroy();
  };
}
