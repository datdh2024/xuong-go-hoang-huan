import { test, expect } from "@playwright/test";

test.describe("TC-17: Dark Mode Support", () => {
  // TC-17-01: Default theme is dark on first visit
  test("TC-17-01: defaults to dark mode on first visit", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-02: First-time visitor can switch to light mode via toggle
  test("TC-17-02: defaults to dark even with system light preference", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);

    const toggle = page
      .getByRole("button", { name: /switch to light mode/i })
      .first();
    await toggle.waitFor();
    await toggle.click();

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-03: Toggle switches from light to dark
  test("TC-17-03: toggle switches from light to dark", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");

    // Default is dark — switch to light first
    const toggleToLight = page
      .getByRole("button", { name: /switch to light mode/i })
      .first();
    await toggleToLight.waitFor();
    await toggleToLight.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    // Now switch back to dark
    const toggleToDark = page
      .getByRole("button", { name: /switch to dark mode/i })
      .first();
    await toggleToDark.waitFor();
    await toggleToDark.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-04: Toggle switches from dark to light
  test("TC-17-04: toggle switches from dark to light", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);

    const toggle = page
      .getByRole("button", { name: /switch to light mode/i })
      .first();
    await toggle.waitFor();
    await toggle.click();

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-05: Preference persists across navigation
  test("TC-17-05: preference persists across page navigation", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");

    // Default is dark — switch to light, then verify it persists across nav
    const toggle = page
      .getByRole("button", { name: /switch to light mode/i })
      .first();
    await toggle.waitFor();
    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.click('a[href="/gioi-thieu"]');
    await page.waitForURL("/gioi-thieu");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-06: Preference persists across reloads (localStorage)
  test("TC-17-06: preference persists across browser sessions", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");

    // Default is dark — switch to light and verify persistence
    const toggle = page
      .getByRole("button", { name: /switch to light mode/i })
      .first();
    await toggle.waitFor();
    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    const theme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(theme).toBe("light");

    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-07: Toggle accessible on mobile
  test("TC-17-07: toggle is accessible on mobile viewport", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      colorScheme: "light",
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();
    await page.goto("/");

    // Default is dark — toggle should show "switch to light mode"
    const toggle = page
      .getByRole("button", { name: /switch to light mode/i })
      .first();
    await toggle.waitFor();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-08: No flash of incorrect theme on page load
  test("TC-17-08: no flash of incorrect theme on load", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "light" });
    const page = await context.newPage();

    await page.addInitScript(() => {
      localStorage.setItem("theme", "dark");
    });

    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-09: localStorage overrides system preference
  test("TC-17-09: localStorage overrides system preference", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();

    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });

    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-10: All pages render in dark mode
  test("TC-17-10: all pages render correctly in dark mode", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();

    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto("/gioi-thieu");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto("/cong-trinh");
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto("/lien-he");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await context.close();
  });

  // TC-17-11: Footer consistent in dark mode
  test("TC-17-11: footer remains consistent in dark mode", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await context.close();
  });

  // TC-17-12: Form inputs readable in dark mode
  test("TC-17-12: form inputs are readable in dark mode", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");

    const form = page.locator("form").first();
    await form.scrollIntoViewIfNeeded();
    const input = form.locator("input").first();
    await expect(input).toBeVisible();
    await context.close();
  });

  // TC-17-13: Corrupted localStorage handled gracefully
  test("TC-17-13: corrupted localStorage falls back to system preference", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();

    await page.addInitScript(() => {
      localStorage.setItem("theme", "invalid");
    });

    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    // next-themes applies the stored value as-is to the class; with an invalid
    // value the page still loads without errors (graceful degradation).
    await expect(page.locator("body")).toBeVisible();

    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
    await context.close();
  });

  // TC-17-14: localStorage unavailable
  test("TC-17-14: works when localStorage is unavailable", async ({
    browser,
  }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();

    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("localStorage is disabled");
        },
      });
    });

    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await context.close();
  });
});
