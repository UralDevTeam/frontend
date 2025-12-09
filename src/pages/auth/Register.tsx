import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { API_BASE } from '../../shared/apiConfig';

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit(e: React.FormEvent) {
        e.preventDefault();

        setError(null);

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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

            setError(message);
        } catch (err: any) {
            setError(err?.message || 'Ошибка сети');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="main">
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
                Зарегистрируйтесь в системе, чтобы видеть организационную структуру и найти коллег
            </p>

            <form onSubmit={submit} className="login-form">
                <p className="login-form__text">Введите данные для регистрации</p>

                <label className="login-form__label">
                    <span className="login-form__label-text">
                        Электронная (корпоративная) почта
                    </span>
                    <input
                        type="email"
                        value={email}
                        className="login-form__input"
                        placeholder="Введите почту"
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={loading}
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
                        disabled={loading}
                    />
                </label>

                <label className="login-form__label">
                    Подтвердить пароль
                    <input
                        type="password"
                        value={confirmPassword}
                        className="login-form__input"
                        placeholder="Введите пароль повторно"
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </label>

                {error && (
                    <div className="login-form__error">
                        {error}
                    </div>
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
        </main>
    );
}
