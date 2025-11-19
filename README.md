## welcome to sherlock-js

<p align=center>
  <br>
  <a href="https://sherlock-project.github.io/" target="_blank"><img src="docs/images/sherlock-logo.png"/></a>
  <br>
  <span>You can search social media accounts by username across <a href="https://sherlockproject.xyz/sites">500+ social networks</a></span>
  <br>
</p>

<p align="center">
  <a href="#installation">Installation</a>
  &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
  <a href="#quick-start">Quick Start</a>
  &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
  <a href="#api-reference">API Reference</a>
  &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
  <a href="#contributing">Contributing</a>
</p>

A TypeScript rewrite of the original [Sherlock](https://github.com/sherlock-project/sherlock) Python project. Search for usernames across 500+ social networks and websites with lightning-fast parallel searching.

## Features

- Flexible Filtering: Filter by content type (SFW/NSFW) or specific sites using whitelists and blacklists
- Detects claimed accounts, available usernames, WAF blocks, and invalid usernames
- Real-time Callbacks: Get results as they arrive with callback support
- Zero Dependencies: Lightweight standalone library
- Full TypeScript Support: Complete type safety

## Installation

```bash
npm install @ilyasuperglue/sherlock-js
# or
yarn add @ilyasuperglue/sherlock-js
# or
pnpm add @ilyasuperglue/sherlock-js
```

## Quick Start

```typescript
import sherlock, { singularSearch, sites } from "@ilyasuperglue/sherlock-js";

// Search across all SFW sites
const results = await sherlock({
  username: "fufufafa",
});

console.log(results);
// [
//   { status: "CLAIMED", url: "https://www.kaskus.co.id/api/users?username=fufufafa", isNSFW: false, time: 156 },
//   ...
// ]
```

## API Reference

### `sherlock(params)`

Main search function for checking a username across multiple sites.

**Parameters:**

```typescript
interface TSherlockParams {
  username: string; // Username to search for (required)
  whitelist?: TSiteKey[]; // Only search these sites
  blacklist?: TSiteKey[]; // Exclude these sites
  type?: "SFW" | "NSFW" | "ALL"; // Filter by content type (default: "SFW")
  callback_each?: (res: FormatedResponse) => void; // Called for each result
  timeout_each?: number; // Timeout per site in ms (default: 3000)
  timeout?: number; // Overall search timeout in ms
}
```

**Returns:**

```typescript
Promise<FormatedResponse[]>;
```

**Example:**

```typescript
const results = await sherlock({
  username: "bahlilgoblin",
  type: "ALL",
  timeout_each: 5000,
  callback_each: (result) => {
    if (result.status === "CLAIMED") {
      console.log(`Found: ${result.url}`);
    }
  },
});
```

### `singularSearch(params)`

Search for a username on a single site.

**Parameters:**

```typescript
interface TSingularSearch {
  username: string; // Username to search for
  site: TSite; // Site configuration object
  timeout?: number; // Timeout in ms (default: 3000)
  abortSignal?: AbortController;
}
```

**Returns:**

```typescript
Promise<FormatedResponse>;
```

**Example:**

```typescript
import { singularSearch, sites } from "@ilyasuperglue/sherlock-js";

const result = await singularSearch({
  username: "john_doe",
  site: sites.GitHub,
  timeout: 5000,
});
```

### Response Status

Each search result contains a status indicating the outcome:

- **`CLAIMED`** - Username exists on this site
- **`AVAILABLE`** - Username does not exist on this site
- **`UNKNOWN`** - Error occurred during check (network error, site error, etc.)
- **`ILLEGAL`** - Username doesn't match the site's requirements
- **`WAF`** - Request was blocked by a Web Application Firewall (e.g., Cloudflare)

### Response Format

```typescript
interface FormatedResponse {
  status: SHERLOCK_STATUS; // Status of the search
  url: string; // URL checked or generated
  isNSFW?: boolean; // Whether the site is NSFW
  time: number; // Response time in milliseconds
}
```

## Advanced Usage

### Search Specific Sites Only

```typescript
const results = await sherlock({
  username: "ijazahjokowi69",
  whitelist: ["GitHub", "Twitter", "LinkedIn"],
});
```

### Exclude Specific Sites

```typescript
const results = await sherlock({
  username: "fufufafa",
  blacklist: ["Pornhub", "OnlyFans"],
});
```

### SFW Only (Default)

```typescript
const results = await sherlock({
  username: "elgemoy",
  type: "SFW", // Only search safe-for-work sites
});
```

### NSFW Only

```typescript
const results = await sherlock({
  username: "fufufafa69",
  type: "NSFW", // Only search adult content sites
});
```

### All Sites (Both SFW and NSFW)

```typescript
const results = await sherlock({
  username: "hidupjokowi",
  type: "ALL",
});
```

### Real-time Results with Callbacks

```typescript
await sherlock({
  username: "must-a-nice",
  callback_each: (result) => {
    console.log(`[${result.status}] ${result.url} (${result.time}ms)`);
  },
});
```

### Custom Timeouts

```typescript
const results = await sherlock({
  username: "xxxSquiward69xxx",
  timeout_each: 5000, // 5 seconds per site
  timeout: 120000, // 120 seconds total search time
});
```

## Supported Sites

The library searches across 500+ sites, view the complete list in the [TSiteKey](src/interfaces/sites.ts) type definition.

## Types

```typescript
export type SHERLOCK_STATUS = "CLAIMED" | "AVAILABLE" | "UNKNOWN" | "ILLEGAL" | "WAF";

export interface FormatedResponse {
  status: SHERLOCK_STATUS;
  url: string;
  isNSFW?: boolean;
  time: number;
}

export type TSiteKey = "GitHub" | "Twitter" | "LinkedIn" | ... // 500+ sites

export interface TSite {
  url: string;
  urlMain: string;
  errorType: "status_code" | "message" | "response_url";
  username_claimed: string;
  isNSFW?: boolean;
  regexCheck?: string;
  errorMsg?: string | string[];
  Headers?: Record<string, string>;
  request_method?: string;
  request_payload?: object;
  urlProbe?: string;
}
```

## Filtering example

```typescript
const results = await sherlock({
  username: "alice",
  timeout: 30000,
});

const claimed = results.filter((r) => r.status === "CLAIMED");
const available = results.filter((r) => r.status === "AVAILABLE");
const errors = results.filter((r) => r.status === "UNKNOWN");

console.log(`Found on ${claimed.length} sites`);
console.log(`Available on ${available.length} sites`);
console.log(`Errors on ${errors.length} sites`);
```

## Limitations

- Web browser not supported due to CORS issue
- Some sites may block automated requests (WAF status)
- Rate limiting on some sites may cause UNKNOWN status
- Proxy fetching not implemented yet
- Multi threading not implemented yet

## License

MIT © 2024

## Credits

- Original Python project: [Sherlock Project](https://github.com/sherlock-project/sherlock) by [Siddharth Dushantha](https://github.com/sdushantha)
- Me (rewrite to typescript) [Ilyas a Yusuf](https://github.com/ilyaSuperGlue)

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests to help improve Sherlock-JS.

---
