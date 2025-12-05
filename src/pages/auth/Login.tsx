import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './Login.css';
import {authStore, LoginCredentials} from "../../features/auth/model";
import {useNavigate} from "react-router";
import LightLogo from "../../shared/logo/Light";

export const Login: React.FC = observer(() => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Редирект если уже авторизован
  useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [authStore.isAuthenticated, navigate]);

  // Редирект при успешной авторизации
  useEffect(() => {
    if (authStore.isAuthenticated && !authStore.isLoading && !authStore.error) {
      navigate('/', { replace: true });
    }
  }, [authStore.isAuthenticated, authStore.isLoading, authStore.error, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const credentials: LoginCredentials = { email, password };
    await authStore.login(credentials);
  };

  return (
    <main className="main">
      <header className="main-header">
        <LightLogo />
      </header>
      <h1 style={{ display: "none" }}>Вход</h1>

      <p className="login-page__text" style={{ marginTop: 128 }}>
        Добро пожаловать в UDV Team Map!
      </p>

      <p className="login-page__text">
        Войдите в систему, чтобы увидеть организационную структуру и найти коллег
      </p>

      <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: 48 }}>
        <p className="login-form__text">Введите данные для входа</p>

        <label className="login-form__label">
          Электронная почта
          <input
            type="email"
            value={email}
            className="login-form__input"
            placeholder="Введите почту"
            onChange={e => setEmail(e.target.value)}
            required
            disabled={authStore.isLoading}
          />
        </label>

        <label className="login-form__label">
          Пароль
          <input
            type="password"
            value={password}
            className="login-form__input"
            placeholder="Введите пароль"
            onChange={e => setPassword(e.target.value)}
            required
            disabled={authStore.isLoading}
          />
        </label>

        {authStore.error && (
          <div className="login-form__error">
            {authStore.error}
          </div>
        )}

        <button
          type="submit"
          disabled={authStore.isLoading}
          className="login-form__button"
        >
          {authStore.isLoading ? 'Вхожу...' : 'Войти'}
        </button>
      </form>
    </main>
  );
});

export default Login;