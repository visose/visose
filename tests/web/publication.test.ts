import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import test from "node:test";
import {
  validateAssetPath,
  validateDist,
  validateRenderedText,
} from "../../scripts/validate-publication.ts";
import { repoRoot, webBuildPath, webReleasePath } from "../../scripts/paths.ts";
import { websiteRoutes } from "../../web/src/lib/website.ts";
import { compileWebsite, loadWebsite } from "../../web/src/lib/content.ts";

const website = loadWebsite(repoRoot);

test("Markdown compilation rejects unsafe content and conflicting section IDs", async () => {
  const root = join(repoRoot, "web/src/content");
  const sources: Record<string, string> = {};
  for (const folder of ["pages", "projects"])
    for (const file of await readdir(join(root, folder)))
      sources[`${folder}/${file}`] = await readFile(
        join(root, folder, file),
        "utf8",
      );
  for (const content of [
    '<script>alert("example")</script>',
    "[Unsafe link](javascript:alert)",
    "## First {#duplicate}\n\nText.\n\n## Second {#duplicate}\n\nText.",
  ]) {
    assert.throws(
      () =>
        compileWebsite({
          ...sources,
          "pages/about.md": `${sources["pages/about.md"]}\n\n${content}`,
        }),
      /unsupported|unsafe|unique/,
    );
  }
  assert.throws(
    () =>
      compileWebsite({
        ...sources,
        "projects/robots.md": sources["projects/robots.md"]!.replace(
          "format:",
          "caseStudy:\n  description: Example project\n  inquiryLabel: Discuss a project\n  area: Application development\nformat:",
        ),
      }),
    /routes must be unique/,
  );
});

test("publication guard rejects private content and unapproved assets", () => {
  assert.deepEqual(
    validateRenderedText("page", "Software for design and engineering."),
    [],
  );
  assert.match(
    validateRenderedText("page", "Private Case Notes").join("\n"),
    /private note/,
  );
  assert.match(
    validateRenderedText("page", "-----BEGIN PRIVATE KEY-----").join("\n"),
    /secret or credential/,
  );
  assert.notEqual(validateAssetPath("/private-client-image.png").length, 0);
});

test("output guard rejects review releases, broken links and unlinked private files", async (t) => {
  const parent = resolve(repoRoot, "artifacts/tests/publication");
  await mkdir(parent, { recursive: true });
  const root = await mkdtemp(join(parent, "fixture-"));
  assert(root.startsWith(parent + sep));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dist = join(root, webBuildPath);
  await mkdir(dist, { recursive: true });
  const html = `<!doctype html><html><head><title>Example</title><meta name="description" content="Example page">
    <meta name="visose-build" content="local-review">
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="Content-Security-Policy" content="form-action 'none'">
    </head><body><h1>Example</h1></body></html>`;
  for (const route of [...websiteRoutes(website), "/404"]) {
    const folder = route === "/404" ? dist : join(dist, route);
    await mkdir(folder, { recursive: true });
    await writeFile(
      join(folder, route === "/404" ? "404.html" : "index.html"),
      html,
    );
  }
  await validateDist({ root, website });
  const brand = join(dist, "brand");
  await mkdir(brand);
  const inspectedImage = await readFile(
    join(repoRoot, "web/public/brand/visose-share.png"),
  );
  const imagePath = join(brand, "visose-share.png");
  await writeFile(imagePath, inspectedImage);
  await validateDist({ root, website });
  const changedImage = Buffer.from(inspectedImage);
  changedImage[changedImage.length - 1] ^= 1;
  await writeFile(imagePath, changedImage);
  await assert.rejects(
    validateDist({ root, website }),
    /binary asset differs from its inspected SHA-256/,
  );
  await writeFile(imagePath, inspectedImage);
  const release = join(root, webReleasePath);
  await mkdir(release, { recursive: true });
  await writeFile(join(release, "index.html"), html);
  await writeFile(join(release, "robots.txt"), "User-agent: *\nDisallow: /\n");
  await assert.rejects(
    validateDist({ root, website, release: true }),
    /local review content cannot be released/,
  );
  await writeFile(
    join(dist, "index.html"),
    html.replace("</body>", '<a href="/projects#missing">Project</a></body>'),
  );
  await assert.rejects(validateDist({ root, website }), /missing anchor/);
  await writeFile(join(dist, "unused.json"), '{"notes":"Private Case Notes"}');
  await assert.rejects(validateDist({ root, website }), /private note/);
});
