Инструкции по использованию userStore (FSD - entities/user)

Файлы:
- model.ts - реализация класса UserStore (makeAutoObservable)
- index.ts - экспорт singleton `userStore`

Пример использования в компоненте (React + MobX):

import React from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from 'entities/user';

export const UserProfileExample = observer(() => {
  const { user, loading, error } = userStore;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user</div>;

  return (
    <div>
      <h3>{user.fio}</h3>
      <div>{user.mail}</div>
      <div>{user.formatTeam}</div>
    </div>
  );
});

Примечания:
- Используйте `userStore.loadUserFromApi(fetcher)` для загрузки данных.
- fetcher должен возвращать `UserDTO`.

