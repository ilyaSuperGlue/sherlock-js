import type { TCommonUrlUsername } from "./types";

const interpolate_string = ({ url, username }: TCommonUrlUsername): string => {
  return url.replace("{}", username);
};

export default interpolate_string;
