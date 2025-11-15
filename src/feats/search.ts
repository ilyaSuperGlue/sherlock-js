import { _sites } from "@resources";
import type { FormatedResponse } from "../interfaces/types";
import type { TSiteKey } from "../interfaces/sites";
import singular_search from "./singular_search";

export interface TSherlockParams {
  username: string;
  whitelist?: TSiteKey[];
  blacklist?: TSiteKey[];
  type?: "SFW" | "NSFW" | "ALL";
  callback_each?: (res: FormatedResponse) => void;
  timeout_each?: number;
  timeout?: number;
}

const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  abortSignal: AbortController
) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => {
        abortSignal.abort();
        return reject(new Error(`Timeout after ${ms}ms`));
      }, ms)
    ),
  ]);
};

const search = async ({
  username,
  blacklist,
  type = "SFW",
  whitelist,
  callback_each,
  timeout_each = 3000,
  timeout,
}: TSherlockParams): Promise<FormatedResponse[]> => {
  const searchController = new AbortController();
  const responses: FormatedResponse[] = [];
  try {
    if (whitelist) {
      for (let i = 0; i < whitelist.length; i++) {
        const site_key = whitelist[i] as TSiteKey;
        const site = _sites[site_key];
        if (site != undefined) {
          const res = await singular_search({
            username,
            site,
            timeout: timeout_each,
          });
          callback_each?.(res);
          responses.push(res);
        } else {
          responses.push({
            status: "UNKNOWN",
            url: site_key + "/" + username,
            time: 0,
            isNSFW: false,
          });
        }
      }
      return responses;
    }

    const loop = async () => {
      for (const key in _sites) {
        const site_key = key as TSiteKey;
        const site = _sites[site_key];
        const is_site_nsfw = site.isNSFW;
        let skip = false;
        if (blacklist && blacklist.includes(site_key)) {
          skip = true;
        }
        if (!skip && type === "NSFW" && !is_site_nsfw) {
          skip = true;
        }
        if (!skip && type === "SFW" && is_site_nsfw) {
          skip = true;
        }

        if (!skip) {
          if (site != undefined) {
            const res = await singular_search({
              username,
              site,
              timeout: timeout_each,
              abortSignal: searchController,
            });
            callback_each?.(res);
            responses.push(res);
          } else {
            responses.push({
              status: "UNKNOWN",
              url: site_key + "/" + username,
              time: 0,
              isNSFW: false,
            });
          }
        }
      }
    };

    if (timeout) {
      await withTimeout(loop(), timeout, searchController);
    } else {
      await loop();
    }
    return responses;
  } catch (error) {
    console.warn(error);
    return responses;
  }
};

export default search;
