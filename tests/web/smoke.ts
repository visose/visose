import assert from "node:assert/strict";
import test from "node:test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { expectedPages } from "../../web/src/lib/website.ts";
import { repoRoot } from "../../scripts/paths.ts";

declare global {
  interface Window {
    visoseReview: { setOutcome(outcome: "success" | "error"): void };
  }
}

const origin = process.env.VISOSE_QA_ORIGIN ?? "http://127.0.0.1:4321";
const address = new URL(origin);
assert(
  address.protocol === "http:" &&
    ["127.0.0.1", "localhost"].includes(address.hostname) &&
    address.pathname === "/" &&
    !address.search &&
    !address.hash &&
    !address.username &&
    !address.password,
  "Smoke checks require a loopback review site",
);
const output = resolve(repoRoot, "artifacts/playwright");

test(
  "site navigation and inert contact form work on desktop and mobile",
  { timeout: 90000 },
  async (t) => {
    await mkdir(output, { recursive: true });
    const browser = await chromium.launch({ channel: "msedge" });
    t.after(() => browser.close());
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    context.on("request", (request) => {
      if (!["127.0.0.1", "localhost"].includes(new URL(request.url()).hostname))
        errors.push(`Unexpected external request: ${request.url()}`);
    });
    page.on("dialog", (dialog) => dialog.dismiss());

    const startupTargets: Record<string, string> = {
      "/": "#home-title",
      "/projects": ".project-case",
      "/projects/robots": "#reference-groups",
    };
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [, route] of expectedPages) {
        // Check the first paint before deferred enhancement scripts run.
        const startupTarget = startupTargets[route];
        if (startupTarget)
          await page.route(origin + route, async (request) => {
            const response = await request.fetch();
            await request.fulfill({
              response,
              body: (await response.text()).replace(
                /<script\b[^>]*\btype="module"[^>]*>[\s\S]*?<\/script>/g,
                "",
              ),
            });
          });
        let response = await page.goto(origin + route);
        if (startupTarget) {
          await page.evaluate(() => document.fonts.ready);
          const target = page.locator(startupTarget).first();
          const initialTop = await target.evaluate(
            (element) => element.getBoundingClientRect().top + scrollY,
          );
          if (width === 390) {
            assert.equal(
              await page.locator("#primary-navigation").isVisible(),
              false,
              "Mobile navigation must be closed at first paint",
            );
            assert.equal(
              await page
                .locator(".site-header")
                .evaluate((header) => getComputedStyle(header).backgroundColor),
              "rgba(0, 0, 0, 0)",
              "The closed header must reveal the background from first paint",
            );
          }
          if (route === "/projects")
            assert.equal(
              await page.locator("#project-index-panel").isVisible(),
              false,
              "The project index must be closed at first paint",
            );
          await page.unroute(origin + route);
          response = await page.reload();
          await page.evaluate(() => document.fonts.ready);
          const finalTop = await target.evaluate(
            (element) => element.getBoundingClientRect().top + scrollY,
          );
          assert(
            Math.abs(finalTop - initialTop) < 1,
            `${route}: startup must not shift content at ${width}px`,
          );
        }
        assert.equal(response?.status(), 200, route);
        assert.equal(
          await page.getByRole("heading", { level: 1 }).isVisible(),
          true,
          route,
        );
        await page.evaluate(() => document.fonts.ready);
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${route} overflows at ${width}px`,
        );
        if (["/", "/contact", "/projects/robots"].includes(route)) {
          const audit = await new AxeBuilder({ page }).analyze();
          assert.deepEqual(audit.violations, [], `Accessibility: ${route}`);
          await page.screenshot({
            path: resolve(
              output,
              `smoke-${route.split("/").at(-1) || "home"}-${width}.png`,
            ),
          });
        }
        if (route === "/projects/robots") {
          const search = page.getByLabel("Search references", { exact: true });
          const firstReference = page.locator(".reference-list a").first();
          await search.scrollIntoViewIfNeeded();
          const searchTop = (await search.boundingBox())!.y;
          async function assertSearchPosition() {
            await page.evaluate(
              () =>
                new Promise((resolve) =>
                  requestAnimationFrame(() => requestAnimationFrame(resolve)),
                ),
            );
            assert.equal((await search.boundingBox())!.y, searchTop);
          }
          await search.fill((await firstReference.textContent())!);
          await firstReference.waitFor({ state: "visible" });
          await assertSearchPosition();
          await search.fill("no-matching-reference-xyz");
          await assertSearchPosition();
          assert.equal(
            await page.locator(".reference-empty").isVisible(),
            true,
          );
          await page.getByRole("button", { name: "Clear search" }).click();
          assert.equal(await search.inputValue(), "");
          await assertSearchPosition();
          assert.equal(
            await page.locator(".reference-empty").isVisible(),
            false,
          );
          const jump = page.locator(".research-links a").first();
          const group = page.locator((await jump.getAttribute("href"))!);
          await jump.click();
          assert.equal(await group.getAttribute("open"), "");
          await group.locator("summary").press("Enter");
          await jump.click();
          assert.equal(await group.getAttribute("open"), "");
        }
      }
    }
    assert.equal((await page.goto(origin + "/missing-page"))?.status(), 404);

    await page.goto(origin);
    const menu = page.getByRole("button", { name: "Menu", exact: true });
    await menu.click();
    await page.keyboard.press("Escape");
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    await menu.click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Projects" })
      .click();
    await page.waitForURL(origin + "/projects");
    const indexToggle = page.getByRole("button", {
      name: "Project index",
      exact: true,
    });
    const index = page.getByRole("navigation", { name: "Project index" });
    for (let cycle = 0; cycle < 2; cycle++) {
      await indexToggle.click();
      await page.waitForFunction(
        () =>
          Math.abs(
            document.querySelector("#project-index")!.getBoundingClientRect()
              .top,
          ) < 2,
      );
      const scroll = await page.evaluate(() => scrollY);
      await indexToggle.click();
      await index.waitFor({ state: "hidden" });
      assert(
        Math.abs((await page.evaluate(() => scrollY)) - scroll) < 2,
        "Closing the project index must preserve the scroll position",
      );
      if (cycle === 0)
        await page.locator(".project-case").last().scrollIntoViewIfNeeded();
    }
    const details = page.locator(".project-details").first();
    await details.locator("summary").click();
    assert.equal(await details.getAttribute("open"), "");

    await page.goto(origin + "/contact");
    const button = page.locator("#send-enquiry");
    await button.click();
    assert.equal(
      await page.locator("#name").getAttribute("aria-invalid"),
      "true",
    );
    await page.locator("#name").fill("Example Buyer");
    await page.locator("#email").fill("buyer@example.com");
    const message = "Local review of a CAD application inquiry.";
    await page.locator("#message").fill(message);
    const optional = page.locator("#optional-details");
    assert.equal(await page.locator("#budget").isVisible(), false);
    await optional.locator("summary").click();
    const budget = "EUR 20,000-30,000";
    await page.locator("#budget").fill(budget);
    await page.evaluate(() => window.visoseReview.setOutcome("error"));
    const failure = page.waitForResponse(
      (response) => response.url() === origin + "/api/contact",
    );
    await button.click();
    assert.equal((await failure).status(), 503);
    await page.locator('#form-status[data-state="error"]').waitFor();
    assert.equal(await page.locator("#message").inputValue(), message);
    assert.equal(await page.locator("#budget").inputValue(), budget);

    await page.evaluate(() => window.visoseReview.setOutcome("success"));
    const success = page.waitForResponse(
      (response) => response.url() === origin + "/api/contact",
    );
    await page.locator("#email").press("Enter");
    const response = await success;
    assert.equal(response.status(), 202);
    assert.equal((await response.json()).simulated, true);
    await page.locator('#form-status[data-state="success"]').waitFor();

    // Errors in collapsed optional fields must remain visible and reachable.
    await optional.locator("summary").click();
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 422,
        json: {
          ok: false,
          simulated: true,
          fieldErrors: { budget: "Check this field." },
        },
      }),
    );
    await button.click();
    await page.locator("#budget[aria-invalid=true]").waitFor();
    assert.equal(await optional.getAttribute("open"), "");
    assert.equal(
      await page
        .locator("#budget")
        .evaluate((field) => field === document.activeElement),
      true,
    );
    await page.unroute("**/api/contact");

    // A live-looking response must not be presented as a successful review submission.
    await page.route("**/api/contact", (route) =>
      route.fulfill({ json: { ok: true, simulated: false, fieldErrors: {} } }),
    );
    await button.click();
    await page.locator('#form-status[data-state="error"]').waitFor();
    assert.equal(await page.locator("#message").inputValue(), message);

    await page.goto(origin + "/projects/robots");
    await page
      .getByRole("link", { name: "Discuss a robotics project" })
      .click();
    await page.waitForURL(
      origin + "/contact?area=Robots%20support%20or%20development",
    );
    assert.equal(await optional.getAttribute("open"), "");
    assert.equal(
      await page.locator("#area").inputValue(),
      "Robots support or development",
    );

    const fallback = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const staticPage = await fallback.newPage();
    await staticPage.goto(origin);
    assert.equal(
      await staticPage
        .getByRole("navigation", { name: "Main navigation" })
        .isVisible(),
      true,
    );
    await staticPage.goto(origin + "/projects/robots");
    await staticPage.locator(".reference-group summary").first().click();
    await staticPage
      .locator(".reference-list a")
      .first()
      .waitFor({ state: "visible" });
    assert.equal(
      await staticPage.locator(".reference-search").isVisible(),
      false,
    );
    await staticPage.goto(origin + "/contact");
    assert.equal(await staticPage.locator("#send-enquiry").isDisabled(), true);
    await fallback.close();
    assert.deepEqual(errors, []);
  },
);
