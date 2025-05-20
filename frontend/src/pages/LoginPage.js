import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Import App.css for shared styles like header and auth container

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика входа
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="auth-page">
      <header className="header">
        <Link to="/" className="logo">BookAndBooks</Link>
        <div className="header-buttons">
          <button className="profile-button" title="Перейти в профиль">
            <i className="fas fa-user"></i>
          </button>
        </div>
      </header>

      <div className="auth-container">
        <h1>Добро пожаловать</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Пароль</label>
          </div>
          <button type="submit" className="auth-button">
            <span>Войти</span>
          </button>
        </form>
        <div className="auth-links">
          <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 