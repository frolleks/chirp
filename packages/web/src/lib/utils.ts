import { type ClassValue, clsx } from "clsx";
import useSWR, { type SWRResponse } from "swr";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Wrapper for fetch for use with swr.
 * @param args
 */
export const fetcher = (args: any) => fetch(args).then((res) => res.json());

/**
 * A React hook for getting the session data.
 *
 * @export
 * @return {SWRResponse<any, any, any>}
 */
export function useSession() {
  return useSWR("/api/v1/auth/session", fetcher);
}
