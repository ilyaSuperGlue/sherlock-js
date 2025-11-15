import type { SHERLOCK_STATUS } from "../../interfaces/types";
import { clouflare_detection } from "../../libs/index";

const status_code_detection = async (
  res: Response
): Promise<{ status: SHERLOCK_STATUS }> => {
  const cf_blocked = await clouflare_detection({
    res,
    errorType: "status_code",
  });

  if (cf_blocked) {
    return {
      status: "WAF",
    };
  }
  const is_exist = res.status >= 200 && res.status < 300;

  return { status: is_exist ? "CLAIMED" : "AVAILABLE" };
};

export default status_code_detection;
