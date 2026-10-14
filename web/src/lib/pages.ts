import { compileWebsite } from "./content.ts";
import type { Page } from "./website.ts";

// Raw glob imports give Markdown edits the same live reload as Astro templates.
const documents = import.meta.glob<string>("../content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
const content = compileWebsite(
  Object.fromEntries(
    Object.entries(documents).map(([path, source]) => [
      path.replace("../content/", ""),
      source,
    ]),
  ),
);
const pages = content.pages;
export const projectGroups = content.projectGroups;

// Presentation only: prose remains ordinary Markdown.
export function groupLinkLists(html: string) {
  return html.replace(
    /<ul>\s*((?:<li><a href="[^"]+">[^<]+<\/a><\/li>\s*)+)<\/ul>/g,
    '<ul class="related-links">\n$1</ul>',
  );
}

export function section(page: Page, id: string) {
  const result = page.sections.find((entry) => entry.id === id);
  if (!result) throw new Error(`Missing section: ${page.key}/${id}`);
  return result;
}

export function page(key: string) {
  const result = pages.find((entry) => entry.key === key);
  if (!result) throw new Error(`Missing page: ${key}`);
  return result;
}
