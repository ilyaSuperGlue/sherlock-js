import { interpolate_string } from "@lib";
import type { TCommonUrlUsername } from "./types";

const curl = async (params: TCommonUrlUsername) => {
  try {
    const url = interpolate_string(params);
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0",
      },
    });
  } catch (error) {}
};
