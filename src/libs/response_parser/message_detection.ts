import type { TSite } from "../../interfaces/sites";
import type { SHERLOCK_STATUS } from "../../interfaces/types";
import { clouflare_detection } from "../../libs";

interface TMessageDetection {
  response: Response;
  errorMsg: TSite["errorMsg"];
}
const message_detection = async ({
  response,
  errorMsg,
}: TMessageDetection): Promise<{ status: SHERLOCK_STATUS }> => {
  const responseText = await response.text();
  let status: SHERLOCK_STATUS = "UNKNOWN";
  const cf_blocked = await clouflare_detection({
    resText: responseText,
    errorType: "message",
  });
  if (cf_blocked) {
    return {
      status: "WAF",
    };
  }
  if (errorMsg) {
    if (typeof errorMsg === "object") {
      const is_exist = !errorMsg.some((it) => responseText.includes(it));
      status = is_exist ? "CLAIMED" : "AVAILABLE";
    } else {
      const is_exist = !responseText.includes(errorMsg);
      status = is_exist ? "CLAIMED" : "AVAILABLE";
    }
  }
  return {
    status,
  };
};

export default message_detection;
