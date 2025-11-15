import {
  regex_check,
  curl,
  status_code_detection,
  message_detection,
  interpolate_string,
} from "../libs";
import { _sites } from "../resources";
import type { TSite } from "../interfaces/sites";
import type { FormatedResponse } from "../interfaces/types";

/*
  1. regex checking the username to save time
  2. fetch the site
  3. cloudflare checking
  4. response checking [ status_code | message | response_url ]
*/

interface TSingularSearch {
  username: string;
  site: TSite;
  timeout?: number;
  abortSignal?: AbortController;
}
const singular_search = async ({
  username,
  site,
  timeout = 3000,
  abortSignal,
}: TSingularSearch): Promise<FormatedResponse> => {
  const url = interpolate_string({ username, ...site });
  const timestamp = Date.now();

  try {
    const { is_regex_pass } = regex_check({
      regexCheck: site.regexCheck,
      username,
    });
    if (!is_regex_pass) {
      return {
        status: "ILLEGAL",
        url,
        isNSFW: site.isNSFW ?? false,
        time: Date.now() - timestamp,
      };
    }
    const response = await curl({
      ...site,
      username,
      timeout,
      abortSignal,
    });
    if (site.errorType === "message") {
      const { status } = await message_detection({
        response,
        errorMsg: site.errorMsg,
      });
      return {
        status,
        url,
        isNSFW: site.isNSFW ?? false,
        time: Date.now() - timestamp,
      };
    }
    const { status } = await status_code_detection(response);
    return {
      status,
      url,
      isNSFW: site.isNSFW ?? false,
      time: Date.now() - timestamp,
    };
  } catch (error) {
    return {
      status: "UNKNOWN",
      url,
      isNSFW: site.isNSFW ?? false,
      time: Date.now() - timestamp,
    };
  }
};

export default singular_search;
