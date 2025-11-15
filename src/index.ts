import { search as sherlock, singular_search } from "./feats/index";
import { _sites } from "./resources/index";
import { type SHERLOCK_STATUS } from "./interfaces/types";
import { type TSite, type TSiteKey, type TSites } from "./interfaces/sites";

export {
  singular_search as singularSearch,
  _sites as sites,
  type SHERLOCK_STATUS,
  type TSite,
  type TSiteKey,
  type TSites,
};

export default sherlock;
