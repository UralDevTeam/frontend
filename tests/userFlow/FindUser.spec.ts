import {BrowserContext, Page, test} from "@playwright/test";

test.describe('Цель: Найти разработчка', () => {

  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({browser}) => {
    context = await browser.newContext({
      extraHTTPHeaders: {
        'Authorization': 'Basic bWFyaWEua290b3ZhQHVkdi5jb206cGFzc3dvcmQ=',
      }
    });
    page = await context.newPage();
  })

})