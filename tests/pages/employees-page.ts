import { Locator, Page } from '@playwright/test';

export class EmployeesPage {
  readonly page: Page;

  // Элементы страницы
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly employeesTable: Locator;
  readonly tableRows: Locator;
  readonly roleFilter: Locator;
  readonly statusFilter: Locator;
  readonly departmentFilter: Locator;
  readonly adminFilterCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;

    // Инициализация локаторов
    this.pageTitle = page.locator('.employees-title');
    this.searchInput = page.locator('#search-name');
    this.employeesTable = page.locator('.employees-table');
    this.tableRows = page.locator('.employees-table-row:not(.add-row)');
    this.roleFilter = page.locator('#search-role');
    this.statusFilter = page.locator('#search-status');
    this.departmentFilter = page.locator('#search-department');
    this.adminFilterCheckbox = page.locator('#only-admin');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/employees');
    await this.waitForLoad();
  }

  async waitForLoad(): Promise<void> {
    await this.pageTitle.waitFor({ state: 'visible' });
    await this.employeesTable.waitFor({ state: 'visible' });
  }

  async searchByName(searchText: string): Promise<void> {
    await this.searchInput.clear();
    await this.searchInput.fill(searchText);
    await this.page.waitForTimeout(1000); // Ждем обновления
  }

  async getSearchResults(): Promise<string[]> {
    const results: string[] = [];
    const rows = await this.tableRows.all();

    for (const row of rows) {
      const text = await row.textContent();
      if (text) results.push(text);
    }

    return results;
  }


  async filterByDepartment(department: string): Promise<void> {
    await this.departmentFilter.selectOption(department);
    await this.page.waitForTimeout(1000);
  }

  async filterByRole(role: string): Promise<void> {
    await this.roleFilter.selectOption(role);
    await this.page.waitForTimeout(1000);
  }
}