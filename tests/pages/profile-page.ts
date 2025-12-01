import { Locator, Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  // Основные элементы
  readonly profileCard: Locator;
  readonly userName: Locator;
  readonly editButton: Locator;

  readonly status: Locator;

  // Базовая информация
  readonly email: Locator;
  readonly experience: Locator;
  readonly manager: Locator;
  readonly role: Locator;
  readonly legalEntity: Locator;
  readonly department: Locator;
  readonly team: Locator;

  // Личная информация
  readonly personalInfoSection: Locator;
  readonly city: Locator;
  readonly birthDate: Locator;
  readonly phone: Locator;
  readonly mattermost: Locator;
  readonly telegram: Locator;
  readonly aboutMe: Locator;

  // Методы для поиска полей по label
  constructor(page: Page) {
    this.page = page;

    // Основные элементы
    this.profileCard = page.locator('.user-profile-card');
    this.userName = page.locator('.user-main-properties-name');
    this.editButton = page.locator('button:has-text("редактировать")');

    this.status = page.locator('.worker-status p');

    // Базовая информация
    this.email = this.getRowByLabel('почта');
    this.experience = this.getRowByLabel('стаж');
    this.manager = this.getRowByLabel('руководитель');
    this.role = this.getRowByLabel('роль');
    this.legalEntity = this.getRowByLabel('юр.лицо');
    this.department = this.getRowByLabel('подразделение');
    this.team = this.getRowByLabel('команда');

    // Личная информация
    this.personalInfoSection = page.locator('text=Личное');
    this.city = this.getRowByLabel('город');
    this.birthDate = this.getRowByLabel('дата рождения');
    this.phone = this.getRowByLabel('телефон');
    this.mattermost = this.getRowByLabel('mattermost');
    this.telegram = this.getRowByLabel('ник tg');
    this.aboutMe = this.getRowByLabel('о себе');
  }

  // Вспомогательный метод для поиска строк по label
  private getRowByLabel(label: string): Locator {
    return this.page.locator(`.row-info:has-text("${label}") .value`);
  }

  // Методы для получения значений
  async getAboutMeText(): Promise<string | null> {
    return await this.aboutMe.textContent();
  }

  async getEmail(): Promise<string | null> {
    return await this.email.textContent();
  }

  async getUserName(): Promise<string | null> {
    return await this.userName.textContent();
  }

  // Методы для действий
  async navigate(): Promise<void> {
    await this.page.goto('/me');
    await this.waitForLoad();
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForSelector('.user-profile-card', { state: 'visible' });
    await this.userName.waitFor({ state: 'visible' });
  }

  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  // Методы для проверок
  async isProfileLoaded(): Promise<boolean> {
    try {
      await this.waitForLoad();
      return true;
    } catch {
      return false;
    }
  }

  async isAboutMeVisible(): Promise<boolean> {
    return await this.aboutMe.isVisible();
  }

  async getAboutMeValue(): Promise<string> {
    return (await this.aboutMe.textContent()) || '';
  }

  async getStatusText(): Promise<string | null> {
    return await this.status.textContent();
  }
}