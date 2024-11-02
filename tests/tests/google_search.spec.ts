import { test, expect } from "@playwright/test";

test.describe("Тестовое для 'ПроКомплаенс'", () => {
  test('Переход на Google и поиск запроса "Автотесты"', async ({ page }) => {
    await test.step("Переход на страницу 'google.com'", async () => {
      await page.goto("https://www.google.com");
    });

    const searchBox = page.getByLabel("Найти");

    await test.step("Ввод в поле поиска 'Автотесты'", async () => {
      await searchBox.fill("Автотесты");
    });

    await test.step("Нажатие кнопки 'Поиск в Google'", async () => {
      await page.getByLabel("Поиск в Google").first().click();
    });

    await test.step("Проверка перехода на страницу с результатами поиска", async () => {
      const url = page.url();
      const decodedUrl = decodeURIComponent(url); // Декодирование URL
      expect(decodedUrl).toContain("https://www.google.com/search?q=Автотесты");
    });

    await test.step("Проверка наличия логотипа", async () => {
      const logo = page.locator('//*[@id="logo"]');
      await expect(logo).toBeVisible();
    });

    await test.step("Проверка количества результатов поиска на первой странице (!=0)", async () => {
      // Ожидание загрузки результатов поиска
      await page.waitForSelector(
        '//*[@id="rso"]//div[starts-with(@class, "g")]'
      );
      // Получение результатов поиска
      const searchResults = page.locator(
        '//*[@id="rso"]//div[starts-with(@class, "g")]'
      );
      const count = await searchResults.count();
      expect(count).toBeGreaterThan(0);
    });

    await test.step("Проверка количества страниц (!=0)", async () => {
      // Проверка наличия кнопки "Следующая"
      const nextButton = page.getByRole("link", { name: "Следующая" });
      await expect(nextButton).toBeVisible();
    });

    const clearButton = page.getByLabel("Очистить");

    await test.step("Проверка наличия кнопки 'Очистить'", async () => {
      await expect(clearButton).toBeVisible();
    });

    await test.step("Нажатие кнопки 'Очистить' и проверка очищения строки поиска", async () => {
      await clearButton.click();
      await expect(searchBox).toHaveValue("");
    });
  });
});
