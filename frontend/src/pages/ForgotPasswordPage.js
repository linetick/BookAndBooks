import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LoginPage.css";
import "../App.css";
import NavigationMenu from "../components/NavigationMenu";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code+password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Шаг 1: отправка email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/forgot_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        setSuccess("На вашу почту отправлен код для восстановления пароля.");
      } else {
        setError(data.error || "Ошибка отправки письма");
      }
    } catch (e) {
      setError("Ошибка соединения с сервером");
    }
    setLoading(false);
  };

  // Шаг 2: ввод кода и нового пароля
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!code || !password || !confirmPassword) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Пароль успешно изменён! Теперь вы можете войти.");
        setStep(3);
      } else {
        setError(data.error || "Ошибка смены пароля");
      }
    } catch (e) {
      setError("Ошибка соединения с сервером");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <NavigationMenu />
      <div style={{ marginLeft: 56, width: '100%' }}>
        <div className="auth-page">
          <header className="header">
            <Link to="/" className="logo">
              BookAndBooks
            </Link>
          </header>
          <div className="auth-container">
            <h1>Восстановление пароля</h1>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder=" "
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>
                  <span>Отправить код</span>
                </button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleResetSubmit}>
                <div className="form-group">
                  <label htmlFor="code">Код из письма</label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder=" "
                    autoComplete="one-time-code"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Новый пароль</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder=" "
                    autoComplete="new-password"
                  />
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
                    autoComplete="new-password"
                  />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>
                  <span>Сменить пароль</span>
                </button>
              </form>
            )}
            {step === 3 && (
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <p>Пароль успешно изменён!</p>
                <Link to="/login" className="nav-button" style={{marginTop: 24, display: 'inline-block'}}>Вернуться ко входу</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 