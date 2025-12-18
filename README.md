
# UralDevTeam — Frontend

Клиентская часть веб-приложения UralDevTeam. Реализована на React (Create React App) и содержит UI для управления пользователями, командами и сотрудниками.

**Project**
- **Stack**: React, TypeScript, Playwright (e2e), Jest (unit).  
- **Repo purpose**: интерфейс для внутренней панели управления компании.

**Quick Start**
- **Install**: `npm ci` — устанавливает зависимости.  
- **Run (dev)**: `npm start` — запускает dev-сервер (обычно http://localhost:3000).  
- **Build**: `npm run build` — production-сборка.  
- **Unit tests**: `npm test` — запускает тесты в режиме watch/jest.  
- **E2E tests**: `npx playwright test` — запускает Playwright тесты, отчёты в `playwright-report`.

Примеры команд:

```
npm ci
npm start
npm run build
npm test
npx playwright test
```

**Project Structure**
- **Source**: [src](src) — основная логика и компоненты.  
- **Public**: [public](public) — статические файлы и точка входа.  
- **Playwright**: [playwright](playwright) и конфигурация [playwright.config.ts](playwright.config.ts) — e2e тесты и отчёты.  
- **Tests**: [tests](tests) — интеграционные/скриншот‑тесты.  
- **Package**: [package.json](package.json) — скрипты и зависимости.

**Development notes**
- Для разработки используйте `npm start`. Компоненты находятся в папке [src](src).  
- Структура фич/модулей разделена по доменам: `features/*`, `pages/*`, `shared/*`.  
- Если добавляете новые зависимости, предпочтительнее фиксировать версии и обновлять `package.json` аккуратно.

**Testing**
- Unit: `npm test` (Jest).  
- E2E: `npx playwright test` — тесты расположены в [playwright](playwright) и в `tests`. Отчёты генерируются в `playwright-report`.

**Formatting & lint**
- В репозитории могут быть настройки ESLint/Prettier (проверьте `package.json`). Запустите локально перед PR.

**Contribution**
- Fork → feature branch → Pull Request.  
- Описание PR: что сделано, как тестировать, какие изменения видимы в UI.  
- Добавляйте тесты для новых фич и исправлений.

**Deploy**
- Сборка `npm run build` создаёт папку `build`, готовую для деплоя на статический хостинг.
