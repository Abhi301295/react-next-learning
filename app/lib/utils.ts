import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}

export const shuffleList = <T>(list: T[]): T[] => {
  return [...list].sort(() => Math.random() - 0.5);
};

export const initialItems = new Array(29_999_999).fill(0).map((_, index) => {
  return {
    id: index,
    isSelected: index === 29_999_999 - 1
  }
});