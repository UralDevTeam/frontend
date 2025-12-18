export const routes = {
  root: (): string => '/',
  me: (): string => '/me',
  meEdit: (): string => '/me/edit',
  employees: (): string => '/employees',
  teams: (): string => '/teams',
  about: (): string => '/about',
  profileView: (id?: string | number): string => (typeof id !== 'undefined' ? `/profile/view/${id}` : '/profile/view/:id'),
  profileEdit: (id?: string | number): string => (typeof id !== 'undefined' ? `/profile/edit/${id}` : '/profile/edit/:id'),
  login: (): string => '/login',
  register: (): string => '/register',
  auth: (): string => '/auth',
};
