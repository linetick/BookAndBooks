import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import './RegisterPage.css';
import '../App.css'; // Import App.css for shared styles like header and auth container

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    // Здесь будет логика регистрации
    console.log('Register attempt:', { email, password });
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
        <h1>Создать аккаунт</h1>
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
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
          </div>
          <button type="submit" className="auth-button">
            <span>Зарегистрироваться</span>
          </button>
        </form>
        <div className="auth-links">
          <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 