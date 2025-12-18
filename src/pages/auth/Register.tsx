import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { API_BASE } from '../../shared/apiConfig';
import './Login.css';
import { useAuthForm } from '../../shared/hooks/use-auth-form';
import { FormField } from '../../shared/form-field/formField';

export default function Register() {
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
    } = useAuthForm({ validatePasswordLength: true });

    async function submit(e: React.FormEvent) {
        e.preventDefault();

        setConfirmError(null);
        setGeneralError(null);

        if (!validate()) {
            return;
        }

        if (password !== confirmPassword) {
            setConfirmError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (res.status === 201) {
                navigate('/login', { replace: true });
                return;
            }

            let message = `Ошибка: ${res.status}`;
            try {
                const data = await res.json();
                if (data?.detail) {
                    message = String(data.detail);
                }
            } catch {
                const text = await res.text().catch(() => '');
                if (text) {
                    message = `Ошибка: ${res.status} ${text}`;
                }
            }

            const lower = message.toLowerCase();

            if (lower.includes('mail') || lower.includes('почт')) {
                setEmailError('Проверьте адрес');
            } else if (lower.includes('password') || lower.includes('парол')) {
                setPasswordError('Проверьте пароль');
            } else {
                setGeneralError('Что-то пошло не так, попробуйте ещё раз');
            }
        } catch {
            setGeneralError('Ошибка сети. Попробуйте ещё раз');
        } finally {
            setLoading(false);
        }
    }

    return (
        < >
            <img
                src="/icons/Light.svg"
                width={130}
                height={25}
                alt="udv|group"
                className="udv-icon"
            />
            <h1 style={{ display: 'none' }}>Регистрация</h1>

            <p className="login-page__text">
                Добро пожаловать в UDV Team Map!
            </p>

            <p className="login-page__text">
                Зарегистрируйтесь в системе, чтобы видеть организационную
                структуру и найти коллег
            </p>

            <form onSubmit={submit} className="login-form">
                <p className="login-form__text">
                    Введите данные для регистрации
                </p>

                <FormField
                    label="Электронная (корпоративная) почта"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Введите почту"
                    disabled={loading}
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
                    disabled={loading}
                    required
                    autoComplete="new-password"
                    error={passwordError}
                />

                <FormField
                    label="Подтвердить пароль"
                    type="password"
                    value={confirmPassword}
                    onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (confirmError) setConfirmError(null);
                        if (generalError) setGeneralError(null);
                    }}
                    placeholder="Введите пароль повторно"
                    disabled={loading}
                    required
                    autoComplete="new-password"
                    error={confirmError}
                />

                {generalError && (
                    <p className="login-form__hint login-form__hint--error">
                        {generalError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="login-form__button"
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>

            <Link to="/login" className="login-form__link">
                Войти →
            </Link>
        </>
    );
}
