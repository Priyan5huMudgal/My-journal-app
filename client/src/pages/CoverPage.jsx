import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CoverPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError('');
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to open journal');
    }
  };

  return (
    <main className="cover-shell">
      <section className="cover-card">
        <div className="cover-glow" />
        <div className="cover-details">
          <p className="subtitle">A vintage companion for growth, craft, and reflection.</p>
          <h1>My Journal</h1>
          <p className="quote">“The quietest pages know the loudest progress.”</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Enter your unique name" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Secret ink" />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="ink-button">Open Journal</button>
          <p className="login-note">
            First time here? <Link to="/register">Open a new story</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default CoverPage;
