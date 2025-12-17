import { Locator, Page } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  readonly profileCard: Locator;
  readonly userName: Locator;
  readonly editButton: Locator;

  readonly status: Locator;

  readonly email: Locator;
  readonly experience: Locator;
  readonly manager: Locator;
  readonly position: Locator;
  readonly legalEntity: Locator;
  readonly department: Locator;
  readonly team: Locator;

  readonly personalInfoSection: Locator;
  readonly city: Locator;
  readonly birthDate: Locator;
  readonly phone: Locator;
  readonly mattermost: Locator;
  readonly telegram: Locator;
  readonly aboutMe: Locator;

  constructor(page: Page) {
    this.page = page;

    this.profileCard = page.locator('.user-profile-card');
    this.userName = page.locator('.user-main-properties-name');
    this.editButton = page.locator('button:has-text("редактировать")');

    this.status = page.locator('.worker-status p');

    this.email = this.getRowByLabel('почта');
    this.experience = this.getRowByLabel('стаж');
    this.manager = this.getRowByLabel('руководитель');
    this.position = this.getRowByLabel('роль');
    this.legalEntity = this.getRowByLabel('юр.лицо');
    this.department = this.getRowByLabel('отдел');
    this.team = this.getRowByLabel('направление');

    this.personalInfoSection = page.locator('text=Личное');
    this.city = this.getRowByLabel('город');
    this.birthDate = this.getRowByLabel('дата рождения');
    this.phone = this.getRowByLabel('телефон');
    this.mattermost = this.getRowByLabel('mattermost');
    this.telegram = this.getRowByLabel('ник telegram');
    this.aboutMe = this.getRowByLabel('обо мне');
  }

  private getRowByLabel(label: string): Locator {
    return this.page.locator(`.row-info:has-text("${label}") .value`);
  }

  async getAboutMeText(): Promise<string | null> {
    return await this.aboutMe.textContent();
  }

  async getEmail(): Promise<string | null> {
    return await this.email.textContent();
  }

  async getUserName(): Promise<string | null> {
    return await this.userName.textContent();
  }

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
