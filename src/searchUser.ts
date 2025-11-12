import { regex_check } from "@lib";
import { _sites } from "@resources";
import type { TSites } from "../resources/interfaces/sites";

export const searchUser = (username: string) => {
  for (const key in _sites) {
    const siteKey = key as keyof TSites;
    const site = _sites[siteKey];
    const { is_regex_pass } = regex_check({
      username,
      regex: site?.regexCheck,
    });
  }
};
