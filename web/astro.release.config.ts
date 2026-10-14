import { resolve } from "node:path";
import base from "./astro.config.ts";
import { repoRoot, webReleasePath } from "../scripts/paths.ts";

export default {
  ...base,
  outDir: resolve(repoRoot, webReleasePath),
  vite: {
    ...base.vite,
    define: {
      "import.meta.env.PUBLIC_RELEASE": JSON.stringify("true"),
    },
  },
} satisfies typeof base;
