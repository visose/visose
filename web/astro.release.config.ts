import { resolve } from "node:path";
import base, { cspDirectives } from "./astro.config.ts";
import { repoRoot, webReleasePath } from "../scripts/paths.ts";

export default {
  ...base,
  outDir: resolve(repoRoot, webReleasePath),
  security: {
    csp: {
      scriptDirective: {
        resources: ["'self'", "https://www.googletagmanager.com"],
      },
      directives: [
        ...cspDirectives.filter(
          (directive) => !directive.startsWith("connect-src"),
        ),
        "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
        "img-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
      ],
    },
  },
  vite: {
    ...base.vite,
    define: {
      "import.meta.env.PUBLIC_RELEASE": JSON.stringify("true"),
    },
  },
} satisfies typeof base;
