import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/MyBooksPage.css";
import { Modal, ThemeToggle, ProfileButton } from "../components";
import { FaTrash, FaPen } from "react-icons/fa";

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
  const [editBookId, setEditBookId] = useState(null);
  const [showEditBookForm, setShowEditBookForm] = useState(false);

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

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту книгу?")) return;
    try {
      await axios.post(
        "http://localhost/api/book_delete.php",
        { id: bookId },
        { withCredentials: true }
      );
      await fetchBooks();
    } catch (err) {
      alert("Ошибка при удалении книги");
    }
  };

  const handleEditBookClick = (book) => {
    setEditBookId(book.id);
    setNewBook({ title: book.title, description: book.description });
    setShowEditBookForm(true);
    setCoverFile(null);
  };

  const handleEditBookSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", editBookId);
    formData.append("title", newBook.title);
    formData.append("description", newBook.description);
    if (coverFile) {
      formData.append("cover", coverFile);
    }
    try {
      await axios.post("http://localhost/api/book_edit.php", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowEditBookForm(false);
      setEditBookId(null);
      setNewBook({ title: "", description: "" });
      setCoverFile(null);
      await fetchBooks();
    } catch (err) {
      alert("Ошибка при редактировании книги");
    }
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
      </header>

      <ThemeToggle />

      <h1>Моя библиотека</h1>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img
              src={`http://localhost/${book.cover_path}`}
              alt={book.title}
              className="book-cover"
            />
            <div className="book-info">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">Автор: {book.author}</p>
              <p className="book-description">{book.description}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  className="edit-book-btn"
                  onClick={() => {
                    console.log("edit click");
                    handleEditBookClick(book);
                  }}
                  type="button"
                  title="Редактировать"
                  aria-label="Редактировать книгу"
                >
                  <FaPen />
                </button>
                <button
                  className="delete-book-btn"
                  onClick={() => {
                    console.log("delete click");
                    handleDeleteBook(book.id);
                  }}
                  type="button"
                  title="Удалить"
                  aria-label="Удалить книгу"
                >
                  <FaTrash />
                </button>
              </div>
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

      <Modal
        isOpen={showEditBookForm}
        onClose={() => setShowEditBookForm(false)}
        className="modal-add-book"
      >
        <form onSubmit={handleEditBookSubmit} className="add-book-form">
          <h2>Редактировать книгу</h2>
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
          <button type="submit">Сохранить изменения</button>
        </form>
      </Modal>
    </div>
  );
};

export default BooksPage;
