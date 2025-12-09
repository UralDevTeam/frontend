import { expect, test } from '@playwright/test';

test.describe('Контент страницы "О нас"', () => {
  test('должна содержать ключевые фразы и термины', async ({ page }) => {

    await page.goto('/about');

    await page.waitForLoadState('networkidle');

    const content = (await page.textContent('body'))?.toLowerCase();

    // Проверяем наличие ключевых фраз
    const expectedPhrases = [
      'udv group',
      'udv team map',
      'интуитивная структура',
      'умный поиск',
      'личные профили',
      'зачем это вам',
      'чувствуете себя частью целого',
      'будете в курсе'
    ];

    for (const phrase of expectedPhrases) {
      expect(content).toContain(phrase.toLowerCase());
    }
  });
});