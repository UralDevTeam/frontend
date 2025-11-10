import React, {useState} from 'react';
import { useNavigate } from 'react-router';
import { API_BASE } from '../../shared/apiConfig';

export default function Register() {
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
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 201) {
        // Успешно создан — перекидываем на логин
        navigate('/login', { replace: true });
        return;
      }

      const text = await res.text().catch(() => '');
      setError(`Ошибка: ${res.status} ${text}`);
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main simple-shadow-card" style={{ maxWidth: 480, margin: '40px auto', padding: 24 }}>
      <h2>Регистрация</h2>
      <form onSubmit={submit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>
            Почта
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>
            Пароль
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </label>
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading}>{loading ? 'Регистрирую...' : 'Зарегистрироваться'}</button>
            <button type="button" onClick={() => navigate('/login')}>Войти</button>
          </div>
        </div>
      </form>
    </main>
  );
}
