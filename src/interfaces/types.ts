/**
 * @interface TCommonUrlUsername
 * @property {string} username
 * @property {string} url
 * @property {string} [urlProbe]
 */
export interface TCommonUrlUsername {
  username: string;
  url: string;
  urlProbe?: string;
}

/**
 *
 * @typedef {string} SHERLOCK_STATUS
 * @enum {string}
 *
 * @description
 * - **CLAIMED** - Username exists on this site
 * - **AVAILABLE** - Username does not exist on this site
 * - **UNKNOWN** - Error occurred while checking (network error, site error, etc)
 * - **ILLEGAL** - Username not allowed on this site (doesn't match regex requirements)
 * - **WAF** - Request blocked by Web Application Firewall (e.g., Cloudflare)
 */
export type SHERLOCK_STATUS =
  | "CLAIMED"
  | "AVAILABLE"
  | "UNKNOWN"
  | "ILLEGAL"
  | "WAF";

/**
 *
 * @interface FormatedResponse
 * @property {SHERLOCK_STATUS} status
 * @property {string} url
 * @property {boolean} [isNSFW]
 * @property {number} time
 *
 */
export interface FormatedResponse {
  status: SHERLOCK_STATUS;
  url: string;
  isNSFW?: boolean;
  time: number;
}
