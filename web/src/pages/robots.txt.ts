import { isRelease } from "../lib/build";

export function GET() {
  return new Response(
    isRelease
      ? "User-agent: *\nAllow: /\nSitemap: https://visose.com/sitemap.xml\n"
      : "User-agent: *\nDisallow: /\n",
  );
}
