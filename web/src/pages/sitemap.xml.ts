import { expectedPages } from "../lib/website";

export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${expectedPages.map(([, route]) => `<url><loc>https://visose.com${route === "/" ? "/" : route}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
