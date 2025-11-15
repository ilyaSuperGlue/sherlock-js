import type { TSite } from "../../interfaces/sites";

const WAFHitMsgs = [
  //2024-05-13 Cloudflare
  ".loading-spinner{visibility:hidden}body.no-js .challenge-running{display:none}body.dark{background-color:#222;color:#d9d9d9}body.dark a{color:#fff}body.dark a:hover{color:#ee730a;text-decoration:underline}body.dark .lds-ring div{border-color:#999 transparent transparent}body.dark .font-red{color:#b20f03}body.dark",
  //2024-11-11 Cloudflare error page
  '<span id="challenge-error-text">',
  //2024-11-11 Cloudfront (AWS)
  "AwsWafIntegration.forceRefreshToken",
  //2024-04-09 PerimeterX / Human Security
  '{return l.onPageView}}),Object.defineProperty(r,"perimeterxIdentifiers",{enumerable:',
];

const clouflare_detection = async ({
  errorType,
  res,
  resText,
}: {
  res?: Response;
  errorType: TSite["errorType"];
  resText?: string;
}): Promise<boolean> => {
  if (errorType === "message" && resText) {
    return WAFHitMsgs.some((it) => resText.includes(it));
  }
  if (res) {
    return [403, 429, 503].includes(res.status);
  }
  return false;
};

export default clouflare_detection;
