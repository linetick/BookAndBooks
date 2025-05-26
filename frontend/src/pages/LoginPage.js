import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./LoginPage.css";
import "../App.css";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
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
    try {
      const response = await fetch("http://localhost/api/login.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginInput, password }),
      });
      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/", { state: { justLoggedIn: true } });
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
        <h1>Добро пожаловать</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              required
              placeholder=" "
            />
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
          </div>
          <button type="submit" className="auth-button">
            <span>Войти</span>
          </button>
        </form>
        <div className="auth-links">
          <p>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
