import { test, expect } from '@playwright/test';

// test.describe('Контент страницы "О нас"', () => {
//   // test.beforeEach(async ({ page }) => {
//   //   await page.goto('/about');
//   // });
//   //TODO поправить когда будет норм авторизация
//

  test('должна содержать ключевые фразы и термины', async ({browser}) => {
    const context = await browser.newContext({
      extraHTTPHeaders: {
        'Authorization': 'Basic bWFyaWEua290b3ZhQHVkdi5jb206cGFzc3dvcmQ=',
      }
    });

    const page = await context.newPage();
    await page.goto('/about');


    const content = await page.textContent('body');

    // Проверяем наличие ключевых фраз
    const expectedPhrases = [
      'UDV Group',
      'UDV Team Map',
      'организационная карта',
      'интерактивная',
      'единая база знаний',
      'интуитивная структура',
      'умный поиск',
      'личные профили'
    ];

    for (const phrase of expectedPhrases) {
      expect(content).toContain(phrase);
    }
  });

//   test('должна содержать списки преимуществ', async ({browser}) => {
//     const context = await browser.newContext({
//       httpCredentials: {
//         username: process.env.USERNAME!,
//         password: process.env.PASSWORD!,
//       }
//     });
//
//     const page = await context.newPage();
//     await page.goto('/about');
//
//     const lists = page.locator('ul');
//     const listCount = await lists.count();
//
//     expect(listCount).toBeGreaterThanOrEqual(2); // Минимум 2 списка
//
//     // Проверяем элементы первого списка
//     const firstListItems = lists.first().locator('li');
//     expect(await firstListItems.count()).toBe(3);
//
//     // Проверяем элементы последнего списка
//     const lastListItems = lists.last().locator('li');
//     expect(await lastListItems.count()).toBe(4);
//   });
//
// });
