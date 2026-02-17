export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: boolean };

export function cn(...values: ClassValue[]) {
  const classes: string[] = [];

  const visit = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") {
      classes.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      for (const item of v) visit(item);
      return;
    }
    if (typeof v === "object") {
      for (const [k, enabled] of Object.entries(v)) {
        if (enabled) classes.push(k);
      }
    }
  };

  for (const v of values) visit(v);
  return classes.join(" ");
}

