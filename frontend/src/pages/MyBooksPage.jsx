import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./MyBooksPage.css";
import { Modal, ThemeToggle, ProfileButton } from "../components";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "", // Обрати внимание, у тебя автор сейчас не заполняется в форме, можно добавить, если нужно
    description: "",
    cover_path: "",
  });
  const navigate = useNavigate();

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

  // Удали эту пустую функцию fetchBooks — она не нужна и перекрывает useEffect

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setCurrentPage(1);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
    setCurrentPage(1);
  };

  const handleAddBookClick = () => {
    setSelectedBook(null); // Закрыть открытую книгу перед показом формы добавления
    setShowAddBookForm(true);
  };

  const handleAddBookSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("description", newBook.description);
    if (coverFile) {
      formData.append("cover", coverFile);
    }

    try {
      await axios.post("http://localhost/api/book_create.php", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowAddBookForm(false);
      setNewBook({ title: "", author: "", description: "", cover_path: "" });
      setCoverFile(null);
      // После успешного добавления книги обновим список
      const response = await axios.get("http://localhost/api/my_books.php", {
        withCredentials: true,
      });
      setBooks(response.data);
    } catch (error) {
      alert("Ошибка при добавлении книги");
    }
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
          <ProfileButton />
        </div>
      </header>

      <ThemeToggle />

      <h1>Библиотека</h1>

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

      {/* Модалка для чтения книги - кнопка закрытия есть внутри Modal */}
      <Modal
        isOpen={!!selectedBook}
        onClose={handleCloseReader}
        className="modal-reader"
      >
        {selectedBook && (
          <>
            <h2>{selectedBook.title}</h2>
            <p className="book-author">Автор: {selectedBook.author}</p>
            <div className="book-text">
              {/* Здесь можно добавить текст страницы книги */}
            </div>
          </>
        )}
      </Modal>

      {/* Модалка для добавления книги - кнопка закрытия есть внутри Modal */}
      <Modal
        isOpen={showAddBookForm}
        onClose={() => setShowAddBookForm(false)}
        className="modal-add-book"
      >
        <form onSubmit={handleAddBookSubmit} className="add-book-form">
          <h2>Добавить книгу</h2>
          <input
            type="text"
            name="title"
            placeholder="Название книги"
            value={newBook.title}
            onChange={handleInputChange}
            required
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
      </Modal>
    </div>
  );
};

export default BooksPage;
