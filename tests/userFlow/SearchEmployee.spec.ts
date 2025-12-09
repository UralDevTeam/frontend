import {expect, test} from "@playwright/test";
import {EmployeesPage} from "../pages/employees-page";

test.describe('Поиск сотрудника', () => {
  let employeesPage: EmployeesPage;

  test.beforeEach(async ({page}) => {
    employeesPage = new EmployeesPage(page);

    await employeesPage.navigate();
  });

  test('Поиск «Белова Татьяна» в разделе Сотрудники', async ({page}) => {
    const searchText = 'Белова Татьяна';

    await expect(employeesPage.pageTitle).toHaveText('Все сотрудники');
    await expect(employeesPage.tableRows.first()).toBeVisible();

    await employeesPage.searchByName(searchText);

    const inputValue = await employeesPage.searchInput.inputValue();
    expect(inputValue).toBe(searchText);

    const foundedRows = await employeesPage.tableRows.all();

    expect(foundedRows.length).toBeGreaterThanOrEqual(1);

    for (const row of foundedRows) {
      expect(await row.textContent()).toContain("Белова Татьяна")
    }
  });
});