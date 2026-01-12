import { clsx } from "clsx";
import { createContext } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const UserContext = createContext();