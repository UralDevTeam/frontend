import {authStore} from "../../features/auth/model";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
  retryCount?: number;
}

class AuthInterceptor {

  async fetchWithAuth(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {

    const { skipAuth = false, retryCount = 0, ...fetchOptions } = options;

    const headers = new Headers(fetchOptions.headers || {});

    // Добавляем токен если требуется авторизация
    if (!skipAuth && authStore.isAuthenticated) {
      headers.set('Authorization', authStore.authorizationHeader);
    }

      const isFormData = typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;

      if (!headers.has('Content-Type') && fetchOptions.body && !isFormData) {
          headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (response.status === 401 && !skipAuth && authStore.isAuthenticated) {
        // Если у нас есть токен, но он невалидный - разлогиниваем
        authStore.logout();
        window.location.href = '/login';
        throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
      }

      return response;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Ошибка сети. Проверьте подключение к интернету.');
      }
      throw error;
    }
  }

  async json<T>(
    url: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const response = await this.fetchWithAuth(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // Если не JSON, пробуем текст
        try {
          const text = await response.text();
          if (text) errorMessage = text;
        } catch {
          // Игнорируем ошибку парсинга
        }
      }

      throw new Error(errorMessage);
    }

    return await response.json() as Promise<T>;
  }
}

export const authInterceptor = new AuthInterceptor();
