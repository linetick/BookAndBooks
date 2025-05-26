import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyBooksPage.css";
import { Modal, ThemeToggle, ProfileButton } from "../components";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    description: "",
  });

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost/api/my_books.php", {
        withCredentials: true,
      });
      setBooks(response.data);
    } catch (err) {
      setError("Не удалось загрузить книги. Возможно, вы не авторизованы.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  const handleAddBookClick = () => {
    setSelectedBook(null);
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
      setNewBook({ title: "", description: "" });
      setCoverFile(null);
      await fetchBooks(); // обновляем книги после добавления
    } catch (error) {
      alert("Ошибка при добавлении книги");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
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

      <Modal
        isOpen={!!selectedBook}
        onClose={handleCloseReader}
        className="modal-reader"
      >
        {selectedBook && (
          <>
            <h2>{selectedBook.title}</h2>
            <p className="book-author">Автор: {selectedBook.author}</p>
            <div className="book-text">{/* Текст книги */}</div>
          </>
        )}
      </Modal>

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
