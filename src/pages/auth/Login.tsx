import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './Login.css';
import { authStore, LoginCredentials } from '../../features/auth/model';
import { Link, useNavigate } from 'react-router';
import { routes } from '../../shared/routes';
import { useAuthForm } from '../../shared/hooks/use-auth-form';
import { FormField } from '../../shared/form-field/formField';

export const Login: React.FC = observer(() => {
    const navigate = useNavigate();

    const {
        email,
        password,
        emailError,
        passwordError,
        generalError,
        setEmailError,
        setPasswordError,
        setGeneralError,
        handleEmailChange,
        handlePasswordChange,
        validate,
    } = useAuthForm({
        validatePasswordLength: false,
    });

    useEffect(() => {
        if (authStore.isAuthenticated) {
            navigate(routes.me(), { replace: true });
        }
    }, [authStore.isAuthenticated, navigate]);

    useEffect(() => {
        if (authStore.isAuthenticated && !authStore.isLoading && !authStore.error) {
            navigate(routes.me(), { replace: true });
        }
    }, [authStore.isAuthenticated, authStore.isLoading, authStore.error, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setGeneralError(null);

        if (!validate()) {
            return;
        }

        const credentials: LoginCredentials = { email, password };
        const result = await authStore.login(credentials);

        if (!result.success) {
            const backendError = authStore.error?.toLowerCase() || '';

            if (result.status === 401) {
                setPasswordError('Неверный пароль');
            } else if (
                backendError.includes('mail') ||
                backendError.includes('почт')
            ) {
                setEmailError('Проверьте адрес');
            } else if (result.status === 0) {
                setGeneralError('Ошибка сети. Попробуйте ещё раз');
            } else {
                setGeneralError('Не удалось войти. Попробуйте ещё раз');
            }
        }
    };

    return (
        <>
            <img
                src="/icons/Light.svg"
                width={130}
                height={25}
                alt="udv|group"
                className="udv-icon"
            />
            <h1 style={{ display: 'none' }}>Вход</h1>

            <p className="login-page__text">
                Добро пожаловать в UDV Team Map!
            </p>

            <p className="login-page__text">
                Войдите в систему, чтобы увидеть организационную структуру и
                найти коллег
            </p>

            <form onSubmit={handleSubmit} className="login-form">
                <p className="login-form__text">Введите данные для входа</p>

                <FormField
                    label="Электронная почта"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Введите почту"
                    disabled={authStore.isLoading}
                    required
                    autoComplete="email"
                    error={emailError}
                />

                <FormField
                    label="Пароль"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Введите пароль"
                    disabled={authStore.isLoading}
                    required
                    autoComplete="current-password"
                    error={passwordError}
                />

                {generalError && (
                    <p className="login-form__hint login-form__hint--error">
                        {generalError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={authStore.isLoading}
                    className="login-form__button"
                >
                    {authStore.isLoading ? 'Вхожу...' : 'Войти'}
                </button>
            </form>

            <Link to={routes.register()} className="login-form__link">
                Зарегистрироваться →
            </Link>
        </>
    );
});

export default Login;
