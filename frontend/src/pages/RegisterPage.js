import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import "../App.css";
import { ThemeToggle } from "../components";
//import { set } from "mongoose";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    setIsLoading(true); // начинаем загрузку

    try {
      const response = await fetch("http://localhost/api/register.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, login, password }),
      });

      if (response.ok) {
        setShowPopup(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else if (response.status === 422) {
        const data = await response.json();
        setFormErrors(data.errors);
      } else {
        alert("Неверный логин или пароль");
      }
    } catch (error) {
      alert("Ошибка соединения с сервером");
    } finally {
      setIsLoading(false); // загрузка завершена
    }
  };

  return (
    <div className="auth-page">
      <header className="header">
        <Link to="/" className="logo">
          BookAndBooks
        </Link>
        <div className="header-buttons">
          <ThemeToggle />
        </div>
      </header>
      <div className="auth-container">
        <h1>Создать аккаунт</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            {formErrors.email && (
              <p className="error-text">{formErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              placeholder=" "
            />
            {formErrors.login && (
              <p className="error-text">{formErrors.login}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            {formErrors.password && (
              <p className="error-text">{formErrors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder=" "
            />
            {formErrors.confirmPassword && (
              <p className="error-text">{formErrors.confirmPassword}</p>
            )}
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <span>Зарегистрироваться</span>
            )}
          </button>
        </form>

        {showPopup && (
          <div className="popup-message">Подтверждение отправлено на почту</div>
        )}
        <div className="auth-links">
          <p>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
