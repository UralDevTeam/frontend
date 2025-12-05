import React, {useState} from 'react';
import {useNavigate} from 'react-router';
import {API_BASE} from '../../shared/apiConfig';
import LightLogo from '../../shared/logo/Light';
import './Login.css'

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Неверный логин или пароль');
        } else {
          const text = await res.text().catch(() => '');
          setError(`Ошибка: ${res.status} ${text}`);
        }
        return;
      }

      navigate('/', {replace: true});
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main">
      <header className="main-header">
        <LightLogo/>
      </header>
      <h1 style={{display: "none"}}>Вход</h1>
      <p className={"login-page__text"} style={{marginTop: 128}}>Добро пожаловать в UDV Team Map!</p>
      <p className={"login-page__text"}>Войдите в систему, чтобы увидеть организационную структуру и найти коллег</p>
      <form onSubmit={submit} className={"login-form"} style={{marginTop: 48}}>
        <p className={"login-form__text"}>Введите данные для входа</p>
        <label className={"login-form__label"}>
          Электронная почта
          <input
            type="email" value={email} className={"login-form__input"} placeholder={"Введите почту"}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label className={"login-form__label"}>
          Пароль
          <input
            type="password" value={password} className={"login-form__input"} placeholder={"Введите пароль"}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div style={{color: 'crimson'}}>{error}</div>}
        <button type="submit" disabled={loading} className={"login-form__button"}>
          {loading ? 'Вхожу...' : 'Войти'}
        </button>

      </form>
    </main>
  );
}
