import { expectedPages } from "../web/src/lib/website.ts";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { repoRoot, webBuildPath, webReleasePath } from "./paths.ts";
import { loadWebsite } from "../web/src/lib/content.ts";
import { readContactForm } from "../web/src/lib/contact.ts";

interface ScanOptions {
  release?: boolean;
  checkImages?: boolean;
}
// Inspected public assets only. Private client assets remain excluded.
const publicationAssets = [
  { path: "/brand/visose.svg", role: "wordmark" },
  { path: "/favicon.svg", role: "favicon" },
  { path: "/brand/robots.svg", role: "project-mark" },
  { path: "/brand/visose-square.png", role: "organization-logo" },
  { path: "/brand/visose-share.png", role: "sharing-image" },
] as const;
const licenses = ["/fonts/DM-Sans-OFL.txt"];
const fontSha256 =
  "ca72d2bcea8f4daa783dbdfa2d9b46068c3ce38168e05918fb867aa453b4f890";
const imageSha256: Record<string, string> = {
  "/brand/visose-square.png":
    "02b4a14f31ebf0ab62fefc4c78bdc6be9ef188feee1fb234754986c0cedefdb6",
  "/brand/visose-share.png":
    "820565248895027033854b15311facc403afcbe4f01d4170e02a097d9f2e7c6c",
};
const blockedPatterns: [string, RegExp][] = [
  [
    "private note or publication marker",
    /\b(?:PRIVATE\s+COMMERCIAL|DO\s+NOT\s+PUBLISH|PRIVATE\s+PLACEHOLDER|Private Case Notes|Protected Historical Record)\b/i,
  ],
  ["non-public mailbox", /\b(?!info@)[a-z0-9._%+-]+@visose\.com\b/i],
  [
    "local filesystem path",
    /(?:\b[a-z]:[\\/]|file:\/{2,}|\\\\[a-z0-9._-]+\\)/i,
  ],
  [
    "private Microsoft or accounting URL",
    /https?:\/\/[^\s<>"']*(?:sharepoint\.com|onedrive\.live\.com|outlook\.office(?:365)?\.com|freeagent\.com)/i,
  ],
  ["personal telephone link", /(?:href\s*=\s*["']tel:|["']tel:\+)/i],
  [
    "secret or credential",
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:github_pat_[a-z0-9_]{20,}|gh[pousr]_[a-z0-9]{20,}|sk-(?:proj-)?[a-z0-9_-]{20,})\b|(?:AccountKey|SharedAccessSignature)\s*=\s*[^\s;]{12,}|(?:client_secret|clientSecret|password|access_token|refresh_token)["']?\s*[:=]\s*["'][^"'\s]{12,}["']/i,
  ],
];

function normalizedPath(value: string) {
  return `/${value.replaceAll("\\", "/").replace(/^\/+/, "")}`;
}

function attributeValue(tag: string, name: string) {
  const match = tag.match(
    new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, "i"),
  );
  return match?.[2];
}

function decodedText(text: string) {
  return text
    .replace(/\\u([0-9a-f]{4})/gi, (_, value) =>
      String.fromCharCode(parseInt(value, 16)),
    )
    .replace(/\\x([0-9a-f]{2})/gi, (_, value) =>
      String.fromCharCode(parseInt(value, 16)),
    )
    .replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, decimal) =>
      String.fromCodePoint(parseInt(hex ?? decimal, hex ? 16 : 10)),
    )
    .replace(/%([0-9a-f]{2})/gi, (_, value) =>
      String.fromCharCode(parseInt(value, 16)),
    )
    .replaceAll("\\/", "/");
}

/** Shared binary/URL allowlist. Arbitrary images or font files cannot enter a review artifact. */
export function validateAssetPath(path: string) {
  const clean = normalizedPath(path.split(/[?#]/, 1)[0]);
  if (
    licenses.includes(clean) ||
    publicationAssets.some((asset) => asset.path === clean) ||
    /^\/_astro\/dm-sans-latin-standard-normal\.[a-z0-9_-]+\.woff2$/i.test(clean)
  )
    return [];
  return [`${path}: asset is not in the explicit publication list`];
}

/** Compressed payload bytes are not text. Binary files are tied to their inspected source hash. */
function validateBinaryAsset(path: string, bytes: Buffer) {
  const errors = validateAssetPath(path);
  const clean = normalizedPath(path);
  const extension = extname(clean).toLowerCase();
  const expectedHash = extension === ".woff2" ? fontSha256 : imageSha256[clean];
  if (
    !expectedHash ||
    createHash("sha256").update(bytes).digest("hex") !== expectedHash
  )
    errors.push(`${path}: binary asset differs from its inspected SHA-256`);
  if (extension === ".woff2") {
    if (
      bytes.length < 48 ||
      bytes.toString("ascii", 0, 4) !== "wOF2" ||
      bytes.readUInt32BE(8) !== bytes.length
    )
      errors.push(`${path}: invalid WOFF2 signature or length`);
  } else if (extension === ".png") {
    if (
      !bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    )
      errors.push(`${path}: invalid PNG signature`);
  } else errors.push(`${path}: unsupported binary asset format`);
  return errors;
}

function scanFile(path: string, bytes: Buffer, options: ScanOptions) {
  if (
    [
      ".webp",
      ".woff2",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".avif",
      ".ico",
      ".ttf",
      ".otf",
    ].includes(extname(path).toLowerCase())
  )
    return validateBinaryAsset(path, bytes);
  return validateRenderedText(path, bytes.toString("utf8"), options);
}

/** Scan text regardless of its filename extension, including emitted maps, JSON and SVG metadata. */
export function validateRenderedText(
  label: string,
  text: string,
  { release = false, checkImages = true }: ScanOptions = {},
) {
  const errors = [];
  const decoded = decodedText(text);
  for (const [description, pattern] of blockedPatterns) {
    if (pattern.test(text) || pattern.test(decoded))
      errors.push(`${label}: ${description}`);
  }
  if (release) {
    if (
      /local-review|X-Review-Outcome|visoseReview|This is a local simulation/i.test(
        decoded,
      )
    )
      errors.push(`${label}: local review content cannot be released`);
    if (
      /Draft notice|must be completed and checked before|does not describe a live inquiry system/i.test(
        decoded,
      )
    )
      errors.push(`${label}: privacy notice is incomplete`);
  }
  if (checkImages) {
    for (const tag of text.match(/<img\b[^>]*>/gi) ?? []) {
      const src = attributeValue(tag, "src");
      const alt = attributeValue(tag, "alt");
      if (!src) {
        errors.push(`${label}: image must have a local listed source`);
        continue;
      }
      errors.push(
        ...validateAssetPath(src).map((error) => `${label}: ${error}`),
      );
      const asset = publicationAssets.find((entry) => entry.path === src);
      if (asset?.role === "wordmark" && alt !== "visose")
        errors.push(`${label}: wordmark alt text must be visose`);
      else if (alt === undefined)
        errors.push(`${label}: image is missing its alt attribute`);
    }
  }
  return [...new Set(errors)];
}

async function listFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink())
      throw new Error(`Publication guard does not accept symlinks: ${path}`);
    if (entry.isDirectory()) files.push(...(await listFiles(path)));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function throwIfInvalid(errors: string[]) {
  if (errors.length)
    throw new Error(
      `Publication guard failed:\n${[...new Set(errors)].map((error) => `- ${error}`).join("\n")}`,
    );
}

export async function validateSource({ root = repoRoot } = {}) {
  const webRoot = join(root, "web");
  const website = loadWebsite(root);
  const form = readContactForm(
    JSON.parse(await readFile(join(root, "shared/contact-form.json"), "utf8")),
  );
  const content = JSON.stringify({ ...website, form });
  const errors = validateRenderedText("Markdown content", content, {
    checkImages: false,
  });
  if (!content.includes("info@visose.com"))
    errors.push("Missing current company contact mailbox");
  const sourceFiles = await listFiles(join(webRoot, "src"));
  for (const file of sourceFiles) {
    if (
      ![".astro", ".ts", ".css", ".json", ".md"].includes(
        extname(file).toLowerCase(),
      )
    ) {
      errors.push(`${relative(root, file)}: unexpected frontend source file`);
      continue;
    }
    errors.push(
      ...validateRenderedText(
        relative(root, file),
        await readFile(file, "utf8"),
        { checkImages: false },
      ),
    );
  }
  const publicFiles = await listFiles(join(webRoot, "public"));
  const publicPaths = new Set(
    publicFiles.map((file) =>
      normalizedPath(relative(join(webRoot, "public"), file)),
    ),
  );
  for (const asset of publicationAssets)
    if (!publicPaths.has(asset.path))
      errors.push(`${asset.path}: listed public asset is missing`);
  for (const file of publicFiles) {
    const path = normalizedPath(relative(join(webRoot, "public"), file));
    if (path !== "/robots.txt" && path !== "/staticwebapp.config.json")
      errors.push(...validateAssetPath(path));
    errors.push(
      ...scanFile(path, await readFile(file), { checkImages: false }),
    );
  }
  throwIfInvalid(errors);
  return { files: sourceFiles.length + publicFiles.length, errors: [] };
}

function checkReviewHtml(label: string, html: string) {
  const errors = [];
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  if (
    !metas.some(
      (tag) =>
        attributeValue(tag, "name") === "visose-build" &&
        attributeValue(tag, "content") === "local-review",
    )
  )
    errors.push(`${label}: missing local-review build marker`);
  if (
    !metas.some(
      (tag) =>
        attributeValue(tag, "name") === "robots" &&
        /noindex/.test(attributeValue(tag, "content") ?? "") &&
        /nofollow/.test(attributeValue(tag, "content") ?? ""),
    )
  )
    errors.push(`${label}: local review must be noindex, nofollow`);
  if (
    !metas.some(
      (tag) =>
        attributeValue(tag, "http-equiv")?.toLowerCase() ===
          "content-security-policy" &&
        /form-action (?:'|&#39;|&apos;)none(?:'|&#39;|&apos;)/.test(
          attributeValue(tag, "content") ?? "",
        ),
    )
  )
    errors.push(
      `${label}: local review must block native form submission with CSP`,
    );
  return errors;
}

export async function validateDist({ root = repoRoot, release = false } = {}) {
  const dist = join(root, release ? webReleasePath : webBuildPath);
  if (!(await stat(dist).catch(() => undefined))?.isDirectory())
    throw new Error("Publication guard requires a completed build");
  const files = await listFiles(dist);
  const errors: string[] = [];
  const pageRoutes = new Map<string, string>([
    ...expectedPages.map(
      ([, route]) =>
        [route === "/" ? "/index.html" : `${route}/index.html`, route] as const,
    ),
    ["/404.html", "/404"],
  ]);
  const htmlByRoute = new Map<string, string>();
  for (const file of files) {
    const path = normalizedPath(relative(dist, file));
    const extension = extname(file).toLowerCase();
    errors.push(
      ...validateRenderedText(path, path, {
        release,
        checkImages: false,
      }),
    );
    if (
      [
        ".webp",
        ".svg",
        ".woff",
        ".woff2",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".avif",
        ".ico",
        ".ttf",
        ".otf",
      ].includes(extension)
    )
      errors.push(...validateAssetPath(path));
    else if (extension === ".html") {
      if (!pageRoutes.has(path)) errors.push(`${path}: unexpected HTML route`);
    } else if (
      ![
        "/robots.txt",
        "/sitemap.xml",
        "/staticwebapp.config.json",
        ...licenses,
      ].includes(path) &&
      !/^\/_astro\/[a-z0-9_.-]+\.(?:js|css)$/i.test(path)
    )
      errors.push(`${path}: unexpected emitted file`);
    const bytes = await readFile(file);
    errors.push(
      ...scanFile(path, bytes, {
        release,
        checkImages: extension === ".html",
      }),
    );
    if (extension === ".html") {
      const html = bytes.toString("utf8");
      const route = pageRoutes.get(path);
      if (route) htmlByRoute.set(route, html);
      if (!release) errors.push(...checkReviewHtml(path, html));
      else if (
        path !== "/404.html" &&
        (/noindex|nofollow/.test(html) || !html.includes('rel="canonical"'))
      )
        errors.push(
          `${path}: release pages need a canonical URL and must allow indexing`,
        );
    }
  }
  for (const route of pageRoutes.values())
    if (!htmlByRoute.has(route)) errors.push(`Missing route: ${route}`);
  const outputs = new Set(
    files.map((file) => normalizedPath(relative(dist, file))),
  );
  for (const [route, html] of htmlByRoute) {
    if (
      (html.match(/<h1(?:\s|>)/g) ?? []).length !== 1 ||
      !/<title>[^<]+<\/title>/.test(html) ||
      !/<meta\s+(?:[^>]*\s)?name="description"\s+content="[^"]+"/.test(html)
    )
      errors.push(`${route}: expected one page heading, title and description`);
    for (const match of html.matchAll(/(?:href|src)=["']([/#][^"']*)["']/g)) {
      const href = match[1]!.replaceAll("&amp;", "&");
      if (href.startsWith("//")) {
        errors.push(`${route}: protocol-relative URL ${href}`);
        continue;
      }
      const url = new URL(href, `https://visose.com${route}`);
      const destination = htmlByRoute.get(url.pathname);
      if (!destination && !outputs.has(url.pathname))
        errors.push(`${route}: missing destination ${href}`);
      if (
        url.hash &&
        destination &&
        !destination.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)
      )
        errors.push(`${route}: missing anchor ${href}`);
    }
  }
  if (
    release &&
    !(await readFile(join(dist, "robots.txt"), "utf8")).includes("Allow: /")
  )
    errors.push("Release robots.txt must allow indexing");
  throwIfInvalid(errors);
  return { files: files.length, release, errors: [] };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const args = process.argv.slice(2);
  if (
    args.some((arg) => !["--source", "--dist", "--release"].includes(arg)) ||
    args.includes("--source") === args.includes("--dist") ||
    (args.includes("--source") && args.includes("--release"))
  )
    throw new Error("Use --source, --dist, or --dist --release");
  const result = args.includes("--source")
    ? await validateSource()
    : await validateDist({ release: args.includes("--release") });
  console.log(
    `Publication ${args.includes("--source") ? "source" : "output"} guard passed (${result.files} files, ${args.includes("--release") ? "release artifact" : "local review"}).`,
  );
}
