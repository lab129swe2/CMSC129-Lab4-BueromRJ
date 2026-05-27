import { expect, test } from "@playwright/test";

test.describe("System tests (user stories)", () => {
  test("User Story 1: sign up and log in with email/password", async ({ page }) => {
    // Covers README User Story #1
    await page.goto("/");

    await expect(page.getByTestId("auth-email")).toBeVisible();
    await expect(page.getByTestId("auth-password")).toBeVisible();
    await expect(page.getByTestId("auth-signup")).toBeVisible();
    await expect(page.getByTestId("auth-login")).toBeVisible();
  });

  test("User Story 2: create tasks and see newest-first ordering", async ({ page }) => {
    // Covers README User Story #2
    await page.goto("/");

    await expect(page.getByTestId("task-title-input")).toBeVisible();
    await expect(page.getByTestId("task-desc-input")).toBeVisible();
    await expect(page.getByTestId("task-add")).toBeVisible();
    await expect(page.getByTestId("task-list")).toBeVisible();
  });

  test("User Story 3: update or delete an existing task", async ({ page }) => {
    // Covers README User Story #3
    await page.goto("/");

    await expect(page.getByTestId("task-item")).toBeVisible();
    await expect(page.getByTestId("task-edit")).toBeVisible();
    await expect(page.getByTestId("task-status")).toBeVisible();
    await expect(page.getByTestId("task-delete")).toBeVisible();
  });
});

