import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const shuffleList = <T>(list: T[]): T[] => {
  return [...list].sort(() => Math.random() - 0.5);
};
