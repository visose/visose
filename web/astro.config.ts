import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { repoRoot, webBuildPath } from "../scripts/paths.ts";

export default defineConfig({
  site: "https://visose.com",
  devToolbar: { enabled: false },
  outDir: resolve(repoRoot, webBuildPath),
  cacheDir: resolve(repoRoot, "artifacts/cache/astro"),
  trailingSlash: "never",
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: [
        "form-action 'none'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
      ],
    },
  },
  server: {
    host: "127.0.0.1",
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "no-store",
    },
  },
  vite: {
    define: {
      "import.meta.env.PUBLIC_RELEASE": JSON.stringify("false"),
    },
    plugins: [tailwindcss()],
    cacheDir: resolve(repoRoot, "artifacts/cache/vite"),
    server: { proxy: { "/api/contact": "http://127.0.0.1:7071" } },
  },
});
