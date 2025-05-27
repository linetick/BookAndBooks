import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext"; // путь уточни
import '../styles/BooksPage.css';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost/api/books.php");
      setBooks(response.data);
    } catch (err) {
      console.error(err);
      setError("Ошибка загрузки книг.");
    } finally {
      setLoading(false);
    }
  };

  // const fetchBookPages = async (bookId) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3001/api/books/${bookId}/pages`
  //     );
  //     return response.data;
  //   } catch (err) {
  //     console.error(err);
  //     setError("Ошибка загрузки страниц.");
  //     return [];
  //   }
  // };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookClick = async (book) => {
    setSelectedBook(book);
    setCurrentPage(1);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (selectedBook && currentPage < selectedBook.pages.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (selectedBook && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleProfileClick = () => {
    navigate(isAuthenticated ? "/profile" : "/login");
  };

  const handleMyBooksClick = () => {
    navigate("/my-books");
  };

  // Фильтрация книг по названию и автору
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="books-page">Загрузка...</div>;
  if (error) return <div className="books-page">{error}</div>;

  return (
    <div className="books-page">
      <header className="header" style={{gap: 16}}>
        <Link to="/" className="logo">
          BookAndBooks
        </Link>
        <input
          type="text"
          className="book-search-input"
          placeholder="Поиск по названию или автору..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{maxWidth: 320, padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--input-border)', fontSize: 16}}
        />
      </header>

      <h1>Библиотека</h1>

      <div className="books-grid">
        {filteredBooks.map((book) => (
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
              {selectedBook.pages.length === 0 ? (
                <p>Пока что книга не содержит страниц.</p>
              ) : !selectedBook.pages[currentPage - 1]?.content ? (
                <p>На этой странице пока нет текста.</p>
              ) : (
                selectedBook.pages[currentPage - 1].content
              )}
            </div>
            {selectedBook.pages.length > 0 && (
              <div className="page-navigation">
                <button
                  className="page-button"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Предыдущая страница
                </button>
                <span className="page-number">
                  Страница {currentPage} из {selectedBook.pages.length}
                </span>
                <button
                  className="page-button"
                  onClick={handleNextPage}
                  disabled={currentPage === selectedBook.pages.length}
                >
                  Следующая страница
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
