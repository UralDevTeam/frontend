import {BrowserContext, expect, Page, test} from '@playwright/test';
import {ProfilePage} from '../pages/profile-page';
import {EditProfilePage} from "../pages/edit-profile-page";


test.describe.configure({mode: 'serial'});
test.describe('Цель: Изменить поле «Обо мне»', () => {

  let context: BrowserContext;
  let page: Page;
  let profilePage: ProfilePage;
  let editProfilePage: EditProfilePage;

  let originalAboutMe: string;
  let originalCity: string;

  async function saveOriginalValues(profilePage: ProfilePage) {
    originalAboutMe = (await profilePage.getAboutMeText()) || '';
    originalCity = (await profilePage.city.textContent()) || '';
  }

  test.beforeAll(async ({browser}) => {
    context = await browser.newContext({
      extraHTTPHeaders: {
        'Authorization': 'Basic bWFyaWEua290b3ZhQHVkdi5jb206cGFzc3dvcmQ=',
      }
    });
    page = await context.newPage();
    profilePage = new ProfilePage(page);
    editProfilePage = new EditProfilePage(page);
  })

  test('Шаг 1: Проверка отображения информации о пользователе', async ({}) => {
    await profilePage.navigate();
    await saveOriginalValues(profilePage);

    await expect(profilePage.profileCard).toBeVisible();

    await expect(profilePage.userName).toBeVisible();
    await expect(profilePage.userName).toContainText('Котова Мария Юрьевна');

    const emailText = await profilePage.getEmail();
    await expect(profilePage.email).toBeVisible();
    expect(emailText).toBe('maria.kotova@udv.com');

    await expect(profilePage.personalInfoSection).toBeVisible();
    await expect(profilePage.aboutMe).toBeVisible();

    const aboutMeText = await profilePage.getAboutMeText();
    expect(aboutMeText).toContain('Отвечаю за стратегию продуктового портфеля и поддерживаю команды в развитии гипотез.');

    await expect(profilePage.editButton).toBeVisible();
  });

  test('Шаг 2: Редактирование полей с последующей отменой', async ({}) => {
    await profilePage.navigate();

    // Переходим в режим редактирования
    await profilePage.editButton.click();

    // Вносим изменения в поля
    const aboutMeText = await editProfilePage.aboutMeTextarea.inputValue();
    await editProfilePage.fillAboutMe(aboutMeText + "+test");
    const editedAboutMeText = await editProfilePage.aboutMeTextarea.inputValue();
    expect(editedAboutMeText).toContain("+test");

    const cityText = await editProfilePage.cityInput.inputValue();
    await editProfilePage.fillCity(cityText + "+test");
    const editedCityText = await editProfilePage.cityInput.inputValue();
    expect(editedCityText).toContain("+test");

    // Отменяем изменения
    await editProfilePage.cancelButton.click();
    await page.waitForTimeout(1000);
    await profilePage.navigate();

    // Проверяем, что изменения не сохранились
    const finalAboutMeText = await profilePage.getAboutMeText();
    expect(finalAboutMeText).not.toContain("+test");

    const finalCityText = await profilePage.city.textContent();
    expect(finalCityText).not.toContain("+test");
  });

  test('Шаг 3: Редактирование полей с сохранением', async ({}) => {
    await profilePage.navigate();

    // Переходим в режим редактирования
    await profilePage.editButton.click();

    // Вносим изменения в поля
    const aboutMeText = await editProfilePage.aboutMeTextarea.inputValue();
    await editProfilePage.fillAboutMe(aboutMeText + "+test");
    const editedAboutMeText = await editProfilePage.aboutMeTextarea.inputValue();
    expect(editedAboutMeText).toContain("+test");

    const cityText = await editProfilePage.cityInput.inputValue();
    await editProfilePage.fillCity(cityText + "+test");
    const editedCityText = await editProfilePage.cityInput.inputValue();
    expect(editedCityText).toContain("+test");

    // Сохраняем изменения
    await editProfilePage.saveButton.click();
    await page.waitForTimeout(1000);
    await profilePage.navigate();

    // Проверяем, что изменения сохранились
    const finalAboutMeText = await profilePage.getAboutMeText();
    expect(finalAboutMeText).toContain("+test");

    const finalCityText = await profilePage.city.textContent();
    expect(finalCityText).toContain("+test");
  });

  test('Шаг 4: Восстановление оригинальных значений', async ({}) => {
    // Проверяем, что тестовые изменения присутствуют
    const currentAboutMeText = await profilePage.getAboutMeText();
    const currentCityText = await profilePage.city.textContent();

    expect(currentAboutMeText).toContain("+test");
    expect(currentCityText).toContain("+test");

    // Переходим в режим редактирования
    await profilePage.editButton.click();

    // Восстанавливаем оригинальные значения
    await editProfilePage.fillAboutMe(originalAboutMe);
    await editProfilePage.fillCity(originalCity);

    // Проверяем, что значения восстановлены
    const restoredAboutMe = await editProfilePage.aboutMeTextarea.inputValue();
    const restoredCity = await editProfilePage.cityInput.inputValue();

    expect(restoredAboutMe).not.toContain("+test");
    expect(restoredCity).not.toContain("+test");
    expect(restoredAboutMe).toBe(originalAboutMe);
    expect(restoredCity).toBe(originalCity);

    // Сохраняем восстановленные значения
    await editProfilePage.saveButton.click();
    await page.waitForTimeout(1000);
    await profilePage.navigate();

    // Проверяем, что на странице профиля отображаются оригинальные значения
    const finalAboutMeText = await profilePage.getAboutMeText();
    const finalCityText = await profilePage.city.textContent();

    expect(finalAboutMeText).toBe(originalAboutMe);
    expect(finalCityText).toBe(originalCity);
  })

})
