import {expect, test} from '@playwright/test';

test.describe('Контент страницы "О нас"', () => {


  test('должна содержать ключевые фразы и термины', async ({browser}) => {
    const context = await browser.newContext({
      extraHTTPHeaders: {
        'Authorization': 'Basic bWFyaWEua290b3ZhQHVkdi5jb206cGFzc3dvcmQ=',
      }
    });

    const page = await context.newPage();
    await page.goto('/about');


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
      expect(content).toContain(phrase);
    }
  });

});