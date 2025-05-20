import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const themes = ['light', 'dark', 'nature', 'ocean'];
      const currentIndex = themes.indexOf(prevTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    });
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="home-page">
      <div className="theme-switcher">
        <button className="theme-button" onClick={toggleTheme} title="Сменить тему">
          <i className={`fas fa-${theme === 'light' ? 'moon' : 
            theme === 'dark' ? 'sun' : 
            theme === 'nature' ? 'leaf' : 'water'}`}></i>
        </button>
      </div>

      <header className="header">
        <Link to="/" className="logo">BookAndBooks</Link>
        <div className="header-buttons">
          <button className="profile-button" title="Перейти в профиль">
            <i className="fas fa-user"></i>
          </button>
          <Link to="/login" className="nav-button">Войти</Link>
        </div>
      </header>

      <section className="home-section">
        <h1>Добро пожаловать в BookAndBooks</h1>
        <p>
          Ваш персональный портал в мир литературы. Здесь вы найдете тысячи книг,
          сможете создавать свои коллекции и делиться впечатлениями с другими читателями.
        </p>
        <Link to="/books" className="nav-button">Начать чтение</Link>
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