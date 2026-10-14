import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "astro/markdown";
import { markdownToHtml } from "satteri";
import { exactKeys, isContentLink, plainText } from "./validation.ts";
import { isProjectDiagram } from "./diagrams.ts";
import {
  expectedPages,
  type Page,
  type ProjectGroup,
  type Section,
  type Website,
} from "./website.ts";

const validId = (value: unknown): value is string =>
  typeof value === "string" && /^[a-z][a-z0-9-]*$/.test(value);

function parseDocument(label: string, source: string) {
  const { frontmatter, content } = parseFrontmatter(source);
  const headings = new Map<string, { heading: string; level: number }>();
  function unsupported() {
    throw new Error(`${label}: unsupported Markdown`);
  }
  function link(node: { url: string }) {
    if (!isContentLink(node.url))
      throw new Error(`${label}: unsafe or unsupported link`);
  }
  const html = markdownToHtml(content, {
    features: { headingAttributes: true },
    mdastPlugins: [
      {
        name: "website-content",
        html: unsupported,
        image: unsupported,
        imageReference: unsupported,
        link,
        definition: link,
        heading(node, context) {
          const properties = (
            node.data as { hProperties?: Record<string, unknown> } | undefined
          )?.hProperties;
          const id = properties?.id;
          const heading = context.textContent(node);
          if (
            context.parent(node)?.type !== "root" ||
            ![2, 3].includes(node.depth) ||
            !validId(id) ||
            id === "introduction" ||
            headings.has(id) ||
            !plainText(heading) ||
            !node.children.every((child) => child.type === "text") ||
            Object.keys(properties ?? {}).join(",") !== "id"
          )
            throw new Error(
              `${label}: headings need unique explicit IDs, plain text and level 2 or 3`,
            );
          headings.set(id, { heading, level: node.depth });
        },
        paragraph(node, context) {
          if (
            node.children.length === 1 &&
            ["link", "linkReference"].includes(node.children[0]!.type)
          )
            context.setProperty(node, "data", {
              hProperties: { className: ["prose-action"] },
            });
        },
      },
    ],
  }).html.trim();
  const matches = [
    ...html.matchAll(/<h([23]) id="([a-z][a-z0-9-]*)">.*?<\/h\1>/g),
  ];
  if (matches.length !== headings.size)
    throw new Error(`${label}: unsupported heading structure`);
  const intro = html.slice(0, matches[0]?.index ?? html.length).trim();
  const sections = matches.map((match, index) => ({
    id: match[2]!,
    ...headings.get(match[2]!)!,
    html: html
      .slice(
        match.index! + match[0].length,
        matches[index + 1]?.index ?? html.length,
      )
      .trim(),
  }));
  if (sections.length && sections[0]!.level !== 2)
    throw new Error(`${label}: the first section needs a level 2 heading`);
  for (const body of [intro, ...sections.map((section) => section.html)]) {
    if (
      !body ||
      /<(?!\/?(?:p|strong|em|a|code|pre|blockquote|ul|ol|li|br|hr|del)(?:\s|>|\/))|\son[a-z]+\s*=|\sstyle\s*=|(?:javascript|data):/i.test(
        body,
      )
    )
      throw new Error(`${label}: empty or unsupported content`);
  }
  return { meta: frontmatter as Record<string, unknown>, intro, sections };
}

/** Compile repository Markdown into runtime data without writing an editorial derivative. */
export function compileWebsite(sources: Record<string, string>): Website {
  const used = new Set<string>();
  const projectGroups: ProjectGroup[] = [];
  const read = (path: string) => {
    const source = sources[path];
    if (source === undefined) throw new Error(`Missing content: ${path}`);
    if (used.has(path)) throw new Error(`Duplicate content reference: ${path}`);
    used.add(path);
    return parseDocument(path, source);
  };
  const pages = expectedPages.map(([key, route]): Page => {
    const { meta, intro, sections } = read(`pages/${key}.md`);
    if (
      !exactKeys(meta, [
        "title",
        "description",
        "heading",
        ...(key === "projects" ? ["groups"] : []),
        ...("action" in meta ? ["action"] : []),
      ]) ||
      !plainText(meta.title) ||
      !plainText(meta.description) ||
      !plainText(meta.heading)
    )
      throw new Error(`pages/${key}.md: invalid page metadata`);
    const opening: Page["opening"] = {
      heading: meta.heading,
      html: intro,
    };
    if ("action" in meta) {
      if (
        !exactKeys(meta.action, ["label", "href"]) ||
        !plainText(meta.action.label) ||
        !isContentLink(meta.action.href)
      )
        throw new Error(`pages/${key}.md: invalid action`);
      opening.action = {
        label: meta.action.label,
        href: meta.action.href,
      };
    }
    if (key === "projects") {
      if (sections.length || !Array.isArray(meta.groups) || !meta.groups.length)
        throw new Error(
          "projects.md: use groups to order individual project documents",
        );
      const ids = new Set<string>();
      function claimId(id: string) {
        if (ids.has(id)) throw new Error(`projects.md: duplicate ID ${id}`);
        ids.add(id);
      }
      for (const group of meta.groups) {
        if (
          !exactKeys(group, ["id", "heading", "projects"]) ||
          !validId(group.id) ||
          !plainText(group.heading) ||
          !Array.isArray(group.projects) ||
          !group.projects.length ||
          !group.projects.every(validId)
        )
          throw new Error("projects.md: invalid project group");
        claimId(group.id);
        const entry: ProjectGroup = {
          id: group.id,
          heading: group.heading,
          projects: [],
        };
        projectGroups.push(entry);
        for (const id of group.projects) {
          claimId(id);
          const project = read(`projects/${id}.md`);
          if (
            !exactKeys(project.meta, [
              "title",
              "format",
              ...("diagram" in project.meta ? ["diagram"] : []),
            ]) ||
            !plainText(project.meta.title) ||
            !plainText(project.meta.format)
          )
            throw new Error(`${id}.md: invalid project metadata`);
          const diagram = project.meta.diagram;
          if (diagram !== undefined && !isProjectDiagram(diagram))
            throw new Error(`${id}.md: invalid project diagram`);
          const details: Section[] = project.sections.map((section) => {
            if (section.level !== 2)
              throw new Error(`${id}.md: project details use level 2 headings`);
            const detailId = `${id}-${section.id}`;
            claimId(detailId);
            return {
              id: detailId,
              heading: section.heading,
              html: section.html,
            };
          });
          entry.projects.push({
            id,
            heading: project.meta.title,
            html: project.intro,
            format: project.meta.format,
            ...(diagram ? { diagram } : {}),
            details,
          });
        }
      }
    }
    return {
      key,
      route,
      title: meta.title,
      description: meta.description,
      opening,
      sections: sections.map(({ id, heading, html }) => ({
        id,
        heading,
        html,
      })),
    };
  });
  const unused = Object.keys(sources).filter((path) => !used.has(path));
  if (unused.length)
    throw new Error(`Unreferenced content: ${unused.join(", ")}`);
  return { pages, projectGroups };
}

/** Node tooling uses the same compiler as Astro, reading only the checkout. */
export function loadWebsite(
  root = fileURLToPath(new URL("../../../", import.meta.url)),
) {
  const contentRoot = join(root, "web/src/content");
  const sources: Record<string, string> = {};
  for (const folder of ["pages", "projects"])
    for (const file of readdirSync(join(contentRoot, folder), {
      withFileTypes: true,
    })) {
      if (!file.isFile() || !file.name.endsWith(".md"))
        throw new Error(`Unexpected content entry: ${folder}/${file.name}`);
      sources[`${folder}/${file.name}`] = readFileSync(
        join(contentRoot, folder, file.name),
        "utf8",
      );
    }
  return compileWebsite(sources);
}
