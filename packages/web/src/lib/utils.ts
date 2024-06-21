import { type ClassValue, clsx } from "clsx";
import useSWR from "swr";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Session {
  user: {
    email: string;
    id: string;
  };
}

export function useSession() {
  const fetcher = (args: any) => fetch(args).then((res) => res.json());
  return useSWR("/api/v1/auth/session", fetcher);
}
