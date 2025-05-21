import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./MyBooksPage.css";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [coverFile, setCoverFile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Временное состояние для демонстрации
  const [showAddBookForm, setShowAddBookForm] = useState(false); // Состояние для отображения формы добавления книги
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    cover_path: "",
  });
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const themes = ["light", "dark", "nature", "ocean"];
      const currentIndex = themes.indexOf(prevTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    });
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost/api/my_books.php", {
          withCredentials: true,
        });
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError("Не удалось загрузить книги. Возможно, вы не авторизованы.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await axios.get('http://localhost:3001/api/books');
      // setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch books");
      setLoading(false);
    }
  };

  const handleBookClick = async (book) => {
    // Логика для открытия книги
    setSelectedBook(book);
    setCurrentPage(1);
  };

  const handleBookClick2 = async (book) => {
    // Логика для открытия книги
    //setSelectedBook(book);
    //setCurrentPage(1);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < selectedBook.pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddBookClick = () => {
    setShowAddBookForm(true); // Показать форму добавления книги
  };

  const handleAddBookSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("description", newBook.description);
    formData.append("cover", coverFile); // Файл

    await axios.post("http://localhost/api/book_create.php", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prevBook) => ({ ...prevBook, [name]: value }));
  };

  if (loading) {
    return <div className="books-page">Loading...</div>;
  }

  if (error) {
    return <div className="books-page">{error}</div>;
  }

  return (
    <div className="books-page">
      <header className="books-header">
        <Link to="/" className="logo">
          BookAndBooks
        </Link>
        <div className="header-buttons">
          <button
            className="profile-button"
            onClick={() => navigate("/profile")}
          >
            👤
          </button>
        </div>
      </header>

      <div className="theme-switcher">
        <button onClick={toggleTheme} className="theme-button">
          {theme === "light" && "🌞"}
          {theme === "dark" && "🌙"}
          {theme === "nature" && "🌿"}
          {theme === "ocean" && "🌊"}
        </button>
      </div>

      <h1>Библиотека</h1>
      {/* <div className="books-actions">
        <button className="add-book-button" onClick={handleAddBookClick}>
          + Добавить книгу
        </button>
      </div> */}

      <div className="books-grid">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => handleBookClick(book)}
          >
            <img
              src={`http://localhost/${book.cover_path}`}
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
        <div className="book-card add-book-card" onClick={handleAddBookClick}>
          <h2>+</h2>
        </div>
      </div>

      {selectedBook && (
        <div className="book-reader-modal">
          <div className="book-reader-content">
            <button className="close-button" onClick={handleCloseReader}>
              ×
            </button>
            <h2>{selectedBook.title}</h2>
            <p className="book-author">Автор: {selectedBook.author}</p>
            <div className="book-text">
              {/* Отображение текста страницы книги */}
            </div>
          </div>
        </div>
      )}

      {showAddBookForm && (
        <div className="book-reader-modal">
          <div className="book-reader-content">
            <button
              className="close-button"
              onClick={() => setShowAddBookForm(false)}
            >
              ×
            </button>

            <form onSubmit={handleAddBookSubmit} className="add-book-form">
              <h2>Добавить книгу</h2>
              <input
                type="text"
                name="title"
                placeholder="Название книги"
                value={newBook.title}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Описание"
                value={newBook.description}
                onChange={handleInputChange}
              />
              <input
                type="file"
                name="cover"
                accept="image/png, image/jpeg"
                onChange={(e) => setCoverFile(e.target.files[0])}
              />
              <button type="submit">Добавить книгу</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
