import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import "../App.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["light", "dark", "nature", "ocean"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }
    try {
      const response = await fetch("http://localhost/api/register.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, login, password }),
      });
      if (response.ok) {
        navigate("/login");
      } else if (response.status === 422) {
        const data = await response.json();
        setFormErrors(data.errors); // Сохран
      } else {
        alert("Неверный логин или пароль");
      }
    } catch (error) {
      alert("Ошибка соединения с сервером");
    }
  };

  return (
    <div className="auth-page">
      <header className="header">
        <Link to="/" className="logo">
          BookAndBooks
        </Link>
        <div className="header-buttons">
          <div className="theme-switcher">
            <button
              className="theme-button"
              onClick={toggleTheme}
              title="Сменить тему"
            >
              {theme === "light" && "🌞"}
              {theme === "dark" && "🌙"}
              {theme === "nature" && "🌿"}
              {theme === "ocean" && "🌊"}
            </button>
          </div>
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
          <button type="submit" className="auth-button">
            <span>Зарегистрироваться</span>
          </button>
        </form>
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
