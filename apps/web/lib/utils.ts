import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prettyDateString(rawDate: Date | string) {
  const date = typeof rawDate === "string" ? new Date(rawDate) : rawDate;

  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

export function isNotNull<T>(value: T | undefined | null): value is T {
  return value != null;
}
