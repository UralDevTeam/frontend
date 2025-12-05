import {API_BASE} from "../apiConfig";
import {authInterceptor} from "./auth-interceptor";

export class ApiClient {
  constructor() {}

  private buildUrl(endpoint: string): string {
    return `${API_BASE}${endpoint}`;
  }

  async get<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    return authInterceptor.json<T>(this.buildUrl(endpoint), {
      ...options,
      method: 'GET',
      skipAuth,
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    return authInterceptor.json<T>(this.buildUrl(endpoint), {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      skipAuth,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    return authInterceptor.json<T>(this.buildUrl(endpoint), {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      skipAuth,
    });
  }

  async delete<T>(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    return authInterceptor.json<T>(this.buildUrl(endpoint), {
      ...options,
      method: 'DELETE',
      skipAuth,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<T> {
    return authInterceptor.json<T>(this.buildUrl(endpoint), {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      skipAuth,
    });
  }

  async fetch(
    endpoint: string,
    options: RequestInit = {},
    skipAuth: boolean = false
  ): Promise<Response> {
    return authInterceptor.fetchWithAuth(this.buildUrl(endpoint), {
      ...options,
      skipAuth,
    });
  }
}

export const apiClient = new ApiClient();
