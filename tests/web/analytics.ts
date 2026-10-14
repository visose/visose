import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium, type BrowserContext, type Page } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { repoRoot, webReleasePath } from "../../scripts/paths.ts";

const origin = "https://visose.com";
const storageKey = "visose.analytics";
const output = join(repoRoot, "artifacts/playwright");
const mime: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
type GoogleWindow = Window & { dataLayer?: IArguments[] };

async function commands(page: Page) {
  return page.evaluate(() =>
    ((window as GoogleWindow).dataLayer ?? []).map((entry) =>
      Array.from(entry),
    ),
  );
}

async function events(page: Page) {
  return (await commands(page)).filter((entry) => entry[0] === "event");
}

// All requests are fulfilled or aborted. These tests cannot send inquiries or analytics.
async function fixture(context: BrowserContext, delayTag?: Promise<void>) {
  const state = {
    tags: 0,
    inquiries: 0,
    accepted: true,
    unexpected: [] as string[],
  };
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (
      url.origin === "https://www.googletagmanager.com" &&
      url.pathname === "/gtag/js"
    ) {
      state.tags++;
      await delayTag;
      await route.fulfill({
        contentType: "text/javascript",
        body: "/* Google tag stub: no collection. */",
      });
    } else if (url.origin === origin && url.pathname === "/api/contact") {
      state.inquiries++;
      await route.fulfill({
        status: state.accepted ? 202 : 503,
        json: { ok: state.accepted, simulated: false, fieldErrors: {} },
      });
    } else if (url.origin === origin) {
      const path = extname(url.pathname)
        ? url.pathname
        : `${url.pathname.replace(/\/$/, "")}/index.html`;
      await route.fulfill({
        body: await readFile(join(repoRoot, webReleasePath, path)),
        contentType: mime[extname(path)] ?? "application/octet-stream",
      });
    } else {
      state.unexpected.push(url.href);
      await route.abort();
    }
  });
  return state;
}

test(
  "analytics requires consent, respects withdrawal and counts only accepted inquiries",
  { timeout: 45000 },
  async (t) => {
    await mkdir(output, { recursive: true });
    const browser = await chromium.launch({ channel: "msedge" });
    t.after(() => browser.close());
    const context = await browser.newContext({ serviceWorkers: "block" });
    const state = await fixture(context);
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const notice = page.getByRole("region", { name: "Website analytics" });

    for (const width of [1440, 1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(origin);
      await notice.waitFor({ state: "visible" });
      assert.equal(state.tags, 0);
      assert.equal((await context.cookies()).length, 0);
      assert.deepEqual(
        (await new AxeBuilder({ page }).analyze()).violations,
        [],
      );
      await page.screenshot({ path: join(output, `analytics-${width}.png`) });
    }
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: width === 1280 ? 720 : 844 });
      await page.goto(origin);
      await notice
        .getByRole("button", { name: "Close analytics notice" })
        .press("Shift+Tab");
      assert.equal(await notice.isVisible(), false);
      assert.equal(
        await page.evaluate(() => document.activeElement?.id),
        "analytics-settings",
      );
      await page
        .getByRole("link", { name: "Analytics settings" })
        .press("Enter");
      await page
        .getByRole("navigation", { name: "Footer" })
        .getByRole("link", { name: "Privacy", exact: true })
        .press("Tab");
      assert.equal(await notice.isVisible(), false);
      assert.equal(
        await page.evaluate(() => document.activeElement?.id),
        "analytics-settings",
      );
    }
    assert.equal(
      await page.evaluate((key) => localStorage.getItem(key), storageKey),
      null,
    );
    assert.equal(state.tags, 0);
    await page.getByRole("link", { name: "Analytics settings" }).press("Enter");
    await page.keyboard.press("Escape");
    assert.equal(await notice.isVisible(), false);
    await page.getByRole("link", { name: "Analytics settings" }).press("Enter");
    const firstTop = await page
      .locator("h1")
      .evaluate((element) => element.getBoundingClientRect().top + scrollY);
    await notice.getByRole("button", { name: "Reject", exact: true }).click();
    assert.equal(
      await page
        .locator("h1")
        .evaluate((element) => element.getBoundingClientRect().top + scrollY),
      firstTop,
    );
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page
        .getByRole("navigation", { name: "Footer" })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: join(output, `analytics-footer-${width}.png`),
      });
    }
    await page.reload();
    assert.equal(await notice.isVisible(), false);
    assert.equal(state.tags, 0);
    await page.getByRole("link", { name: "Analytics settings" }).click();
    await notice
      .getByRole("button", { name: "Accept analytics", exact: true })
      .click();
    await page.waitForFunction(() =>
      (window as GoogleWindow).dataLayer?.some((entry) => entry[0] === "event"),
    );
    assert.equal(state.tags, 1);
    assert.equal(
      (await events(page)).filter((entry) => entry[1] === "page_view").length,
      1,
    );
    const config = (await commands(page)).find(
      (entry) => entry[0] === "config",
    )![2] as Record<string, unknown>;
    assert.equal(config.allow_google_signals, false);
    assert.equal(config.allow_ad_personalization_signals, false);
    assert.equal(config.send_page_view, false);

    await page.goto(origin + "/projects/robots");
    await page.waitForFunction(() =>
      (window as GoogleWindow).dataLayer?.some((entry) => entry[0] === "event"),
    );
    assert.equal(await notice.isVisible(), false);
    assert.equal(
      ((await events(page))[0]![2] as Record<string, unknown>).content_group,
      "Robots",
    );

    await page.goto(origin + "/contact?email=private%40example.com#private", {
      referer: "https://www.google.com/search?q=private%40example.com",
    });
    await page.waitForFunction(() =>
      (window as GoogleWindow).dataLayer?.some((entry) => entry[0] === "event"),
    );
    const submit = page.getByRole("button", {
      name: "Send inquiry",
      exact: true,
    });
    await submit.click();
    assert.equal(state.inquiries, 0);
    await page.locator("#name").fill("Private Example");
    await page.locator("#email").fill("private@example.com");
    await page.locator("#message").fill("Private project details.");
    state.accepted = false;
    await submit.click();
    await page.locator('#form-status[data-state="error"]').waitFor();
    assert.equal(
      (await events(page)).filter((entry) => entry[1] === "generate_lead")
        .length,
      0,
    );
    state.accepted = true;
    await page.locator("#contact-form").evaluate((form: HTMLFormElement) => {
      form.requestSubmit();
      form.requestSubmit();
    });
    await page.locator('#form-status[data-state="success"]').waitFor();
    assert.equal(state.inquiries, 2);
    const leads = (await events(page)).filter(
      (entry) => entry[1] === "generate_lead",
    );
    assert.equal(leads.length, 1);
    assert.equal(
      (leads[0]![2] as Record<string, unknown>).page_location,
      origin + "/contact",
    );
    assert.equal(
      (leads[0]![2] as Record<string, unknown>).page_referrer,
      "https://www.google.com/",
    );
    assert(
      !/Private Example|private@|private%40|Private project|#private/.test(
        JSON.stringify(await commands(page)),
      ),
    );

    await context.addCookies([
      { name: "_ga", value: "test", domain: "visose.com", path: "/" },
      {
        name: "_ga_0P4KTCKRFM",
        value: "test",
        domain: ".visose.com",
        path: "/",
      },
    ]);
    const otherTab = await context.newPage();
    await otherTab.goto(origin);
    await otherTab.getByRole("link", { name: "Analytics settings" }).click();
    await otherTab.getByRole("button", { name: "Reject", exact: true }).click();
    await page.waitForFunction(
      () =>
        (window as Window & { "ga-disable-G-0P4KTCKRFM"?: boolean })[
          "ga-disable-G-0P4KTCKRFM"
        ] === true,
    );
    assert.equal(
      (await context.cookies()).filter((cookie) =>
        cookie.name.startsWith("_ga"),
      ).length,
      0,
    );
    await submit.click();
    await page.locator('#form-status[data-state="success"]').waitFor();
    assert.equal(
      (await events(page)).filter((entry) => entry[1] === "generate_lead")
        .length,
      1,
    );
    await page.reload();
    assert.deepEqual(await commands(page), []);
    assert.equal(await notice.isVisible(), false);
    assert.deepEqual(errors, []);
    assert.deepEqual(state.unexpected, []);
  },
);

test(
  "late tag loading and invalid or unavailable consent storage fail closed",
  { timeout: 30000 },
  async (t) => {
    const browser = await chromium.launch({ channel: "msedge" });
    t.after(() => browser.close());
    const context = await browser.newContext({ serviceWorkers: "block" });
    const delayed = Promise.withResolvers<void>();
    const state = await fixture(context, delayed.promise);
    const page = await context.newPage();
    await page.goto(origin);
    await page
      .getByRole("button", { name: "Accept analytics", exact: true })
      .click();
    await page.getByRole("link", { name: "Analytics settings" }).click();
    await page.getByRole("button", { name: "Reject", exact: true }).click();
    const finished = page.waitForEvent("requestfinished", {
      predicate: (request) => request.url().includes("googletagmanager"),
    });
    delayed.resolve();
    await finished;
    assert.equal(state.tags, 1);
    assert.deepEqual(await events(page), []);

    for (const value of [
      "invalid",
      JSON.stringify({ accepted: true, expires: Date.now() - 1000 }),
    ]) {
      await page.evaluate(
        ({ key, value }) => localStorage.setItem(key, value),
        { key: storageKey, value },
      );
      await page.reload();
      await page
        .getByRole("region", { name: "Website analytics" })
        .waitFor({ state: "visible" });
      assert.deepEqual(await commands(page), []);
    }
    await page.evaluate(
      (key) =>
        localStorage.setItem(
          key,
          JSON.stringify({ accepted: true, expires: Date.now() + 86400000 }),
        ),
      storageKey,
    );
    await page.reload();
    await page.waitForFunction(() =>
      (window as GoogleWindow).dataLayer?.some((entry) => entry[0] === "event"),
    );
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => {
        throw new Error("Storage blocked");
      };
    });
    await page.reload();
    await page.waitForFunction(() =>
      (window as GoogleWindow).dataLayer?.some((entry) => entry[0] === "event"),
    );
    const tagsBeforeRejection = state.tags;
    await page.getByRole("link", { name: "Analytics settings" }).click();
    await page.getByRole("button", { name: "Reject", exact: true }).click();
    assert.equal(
      await page.evaluate((key) => localStorage.getItem(key), storageKey),
      null,
    );
    await page.reload();
    assert.deepEqual(await commands(page), []);
    await page
      .getByRole("button", { name: "Accept analytics", exact: true })
      .click();
    assert.equal(await page.locator("#analytics-status").isVisible(), true);
    assert.deepEqual(await commands(page), []);
    assert.equal(state.tags, tagsBeforeRejection);
    assert.deepEqual(state.unexpected, []);
  },
);
