import { Locator, Page } from '@playwright/test';

export class EditProfilePage {
  readonly page: Page;

  // Поля ввода
  readonly cityInput: Locator;
  readonly birthDateInput: Locator;
  readonly phoneInput: Locator;
  readonly mattermostInput: Locator;
  readonly telegramInput: Locator;
  readonly aboutMeTextarea: Locator;
  readonly statusSelect: Locator;

  // Кнопки
  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Инициализируем поля ввода
    this.cityInput = this.getInputByLabel('город');
    this.birthDateInput = this.getInputByLabel('дата рождения');
    this.phoneInput = this.getInputByLabel('телефон');
    this.mattermostInput = this.getInputByLabel('mattermost');
    this.telegramInput = this.getInputByLabel('ник tg');
    this.aboutMeTextarea = page.locator('.row-info:has-text("о себе") textarea');
    this.statusSelect = page.locator('#status');

    // Инициализируем кнопки
    this.cancelButton = page.locator('button:has-text("отменить")');
    this.saveButton = page.locator('button:has-text("сохранить")');
  }

  // Вспомогательный метод для поиска полей ввода по label
  private getInputByLabel(label: string): Locator {
    return this.page.locator(`.row-info:has-text("${label}") input`);
  }

  // Методы для действий
  async waitForLoad(): Promise<void> {
    await this.page.waitForSelector('.user-profile-card', { state: 'visible' });
    await this.aboutMeTextarea.waitFor({ state: 'visible' });
  }

  async fillAboutMe(text: string): Promise<void> {
    await this.aboutMeTextarea.clear();
    await this.aboutMeTextarea.fill(text);
  }

  async fillCity(city: string): Promise<void> {
    await this.cityInput.clear();
    await this.cityInput.fill(city);
  }

  async selectStatus(status: 'active' | 'vacation' | 'sickLeave'): Promise<void> {
    await this.statusSelect.selectOption(status);
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForURL('/me');
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForURL('/me');
  }

  // Получение текущих значений
  async getAboutMeValue(): Promise<string> {
    return (await this.aboutMeTextarea.inputValue()) || '';
  }

  async getCityValue(): Promise<string> {
    return (await this.cityInput.inputValue()) || '';
  }

  async getStatusValue(): Promise<string> {
    return (await this.statusSelect.inputValue()) || '';
  }
}