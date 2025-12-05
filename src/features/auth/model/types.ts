export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthState {
  token: string | null;
  tokenType: string;
  isLoading: boolean;
  error: string | null;
}