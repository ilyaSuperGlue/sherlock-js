import { generateUserAgent, interpolate_string } from "../index";
import type { TSite } from "../../interfaces/sites.ts";

interface TCurl extends TSite {
  username: string;
  timeout?: number;
  abortSignal?: AbortController;
}

const curl = async (params: TCurl): Promise<Response> => {
  const controller = new AbortController();
  const url = interpolate_string(params);
  const method = params.request_method ?? "GET";
  const body = params.request_payload
    ? JSON.stringify(params.request_payload)
    : undefined;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, params.timeout ?? 3000);

  if (params?.abortSignal?.signal?.aborted) {
    controller.abort();
  }

  const res = await fetch(url, {
    method,
    headers: {
      "User-Agent": generateUserAgent(),
      ...params.Headers,
    },
    redirect: params.errorType === "response_url" ? "manual" : undefined,
    body,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId);
  });
  return res;
};

export default curl;
