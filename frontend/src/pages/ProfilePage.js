import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/ProfilePage.css";
import axios from "axios";

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };
  return (
    <button className="logout-avatar-btn" title="Выйти" onClick={handleLogout}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        style={{ stroke: "var(--text-primary)" }}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  );
};

const ProfilePage = () => {
  const { isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.id === "test_user_id") {
        setUser(parsed);
        setLoading(false);
        return;
      }
    }
    // Если не тестовый пользователь, делаем GET-запрос через axios
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost/api/profile.php", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        setError("Не удалось загрузить профиль. Возможно, вы не авторизованы.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      <header className="header">
        <Link to="/" className="logo">
          BookAndBooks
        </Link>
        <ThemeToggle />
      </header>
      <div className="profile-container">
        <div className="profile-header">
          <h1>Профиль пользователя</h1>
        </div>
        <div className="profile-content">
          {loading ? (
            <div>Загрузка...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : (
            <>
              <div className="profile-info">
                <div className="profile-avatar">
                  <span>👤</span>
                </div>
                <div className="profile-details">
                  <h2>{user?.login || "Пользователь"}</h2>
                  <p className="profile-email">
                    {user?.email || "Email не указан"}
                  </p>
                </div>
                <LogoutButton onLogout={logout} />
              </div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Прочитано книг</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">В избранном</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Добавлено книг</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
