import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import '../App.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'nature', 'ocean'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Set initial theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, []);

  const handleProfileClick = () => {
    // Placeholder for profile click logic
    console.log('Profile button clicked');
  };

  return (
    <div className="home-page">
      <header className="header">
        <Link to="/" className="logo">BookAndBooks</Link>
        <div className="header-buttons">
          {isAuthenticated ? (
            <button className="profile-button" title="Перейти в профиль" onClick={handleProfileClick}>
              <i className="fas fa-user"></i>
            </button>
          ) : (
            <button className="nav-button" onClick={() => navigate('/login')}>Войти</button>
          )}
          <div className="theme-switcher">
            <button className="theme-button" onClick={toggleTheme} title="Сменить тему">
              {theme === 'light' && '🌞'}
              {theme === 'dark' && '🌙'}
              {theme === 'nature' && '🌿'}
              {theme === 'ocean' && '🌊'}
            </button>
          </div>
        </div>
      </header>

      <section className="home-section">
        <h1>Добро пожаловать в BookAndBooks</h1>
        <p>
          Ваш персональный портал в мир литературы. Здесь вы найдете тысячи книг,
          сможете создавать свои коллекции и делиться впечатлениями с другими читателями.
        </p>
        <button className="nav-button" onClick={() => navigate('/books')}>Начать чтение</button>
      </section>

      <section className="home-section">
        <h2>Почему BookAndBooks?</h2>
        <div className="features">
          <div className="feature">
            <i className="fas fa-book"></i>
            <h3>Богатая библиотека</h3>
            <p>Доступ к тысячам книг различных жанров</p>
          </div>
          <div className="feature">
            <i className="fas fa-users"></i>
            <h3>Сообщество читателей</h3>
            <p>Общайтесь с единомышленниками и делитесь впечатлениями</p>
          </div>
          <div className="feature">
            <i className="fas fa-bookmark"></i>
            <h3>Персональные коллекции</h3>
            <p>Создавайте свои подборки и сохраняйте любимые книги</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 