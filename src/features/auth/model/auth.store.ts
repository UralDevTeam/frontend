import {makeAutoObservable, reaction, runInAction} from 'mobx';
import {AuthResponse, AuthState, LoginCredentials} from './types';
import {AUTH_STATE_KEY, AUTH_STORAGE_KEY, LocalStorage} from "../../../shared/lib/storage/local-storage";
import {API_BASE} from "../../../shared/apiConfig";

export class AuthStore implements AuthState {
  token: string | null = null;
  tokenType: string = 'bearer';
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();

    // Автоматически сохраняем изменения в localStorage
    reaction(
      () => ({
        token: this.token,
        tokenType: this.tokenType,
      }),
      (authData) => {
        LocalStorage.set(AUTH_STATE_KEY, authData);
      }
    );
  }

  private loadFromStorage(): void {
    const savedAuth = LocalStorage.get<Partial<AuthState>>(AUTH_STATE_KEY);
    if (savedAuth) {
      this.token = savedAuth.token || null;
      this.tokenType = savedAuth.tokenType || 'bearer';
    }
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token) {
      LocalStorage.set(AUTH_STORAGE_KEY, token);
    } else {
      LocalStorage.remove(AUTH_STORAGE_KEY);
    }
  }

  setTokenType(tokenType: string): void {
    this.tokenType = tokenType;
  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  setError(error: string | null): void {
    this.error = error;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get authorizationHeader(): string {
    if (!this.token) return '';
    return `${this.tokenType.charAt(0).toUpperCase() + this.tokenType.slice(1)} ${this.token}`;
  }

  async login(credentials: LoginCredentials): Promise<void> {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      const res = await fetch(API_BASE + `/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        // Пробуем получить текст ошибки из ответа
        let errorMessage = `Ошибка авторизации: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Если не JSON, пробуем текст
          try {
            const text = await res.text();
            if (text) errorMessage = text;
          } catch {
            // Игнорируем ошибку парсинга
          }
        }
        throw new Error(errorMessage);
      }

      const data: AuthResponse = await res.json();

      runInAction(() => {
        this.setToken(data.accessToken);
        this.setTokenType(data.tokenType);
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        this.isLoading = false;
      });
    }
  }

  logout(): void {
    runInAction(() => {
      this.token = null;
      this.tokenType = 'bearer';
      this.error = null;
      LocalStorage.clear();
    });
  }
}

export const authStore = new AuthStore();