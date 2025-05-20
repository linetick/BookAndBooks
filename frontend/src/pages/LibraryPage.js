import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; // Import App.css for shared styles
import './LibraryPage.css'; // Import styles for this page

const LibraryPage = () => {
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);

  // Placeholder authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Example check
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
    // Load temporary book data for demonstration
    const testBooks = [
      {
        id: 1,
        title: "Тайны океана",
        author: "Анна Морская",
        cover_path: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
        description: "Захватывающая история о глубинах океана и его обитателях"
      },
      {
        id: 2,
        title: "Город мечты",
        author: "Максим Городской",
        cover_path: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=60",
        description: "История о современном мегаполисе и его жителях"
      },
      {
        id: 3,
        title: "Звёздный путь",
        author: "Елена Космическая",
        cover_path: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60",
        description: "Фантастическое путешествие по просторам космоса"
      },
      {
        id: 4,
        title: "Лесные сказки",
        author: "Иван Лесной",
        cover_path: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60",
        description: "Волшебные истории о жизни лесных обитателей"
      },
      {
        id: 5,
        title: "Горные вершины",
        author: "Алексей Альпинист",
        cover_path: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60",
        description: "Приключения в мире высоких гор и их тайн"
      },
      {
        id: 6,
        title: "Пустынные тропы",
        author: "Мария Сахара",
        cover_path: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop&q=60",
        description: "История о жизни в самом жарком месте на Земле"
      },
      {
        id: 7,
        title: "Арктические истории",
        author: "Пётр Северный",
        cover_path: "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&auto=format&fit=crop&q=60",
        description: "Рассказы о жизни в царстве вечной мерзлоты"
      }
    ];
    setBooks(testBooks);
  }, [navigate]);

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

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
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="library-page">
      <header className="header">
        <Link to="/" className="logo">BookAndBooks</Link>
        <div className="header-buttons">
          {/* Profile Button - will add full logic later */}
          <button className="profile-button" title="Перейти в профиль">
            👤
          </button>
          {/* Theme Switcher - will add full logic later */}
          <div className="theme-switcher">
            <button className="theme-button" title="Сменить тему">
              {theme === 'light' && '🌞'}
              {theme === 'dark' && '🌙'}
              {theme === 'nature' && '🌿'}
              {theme === 'ocean' && '🌊'}
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <h1>Ваша библиотека</h1>
        <div className="library-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img
                src={book.cover_path}
                alt={book.title}
                className="book-cover"
              />
              <div className="book-info">
                <h2 className="book-title">{book.title}</h2>
                <p className="book-author">Автор: {book.author}</p>
                <p className="book-description">{book.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage; 