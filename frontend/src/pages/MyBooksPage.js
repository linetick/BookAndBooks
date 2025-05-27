import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/MyBooksPage.css";
import { Modal, ThemeToggle, ProfileButton } from "../components";
import { FaTrash, FaPen, FaTimes, FaPlus } from "react-icons/fa";

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
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteBookTitle, setDeleteBookTitle] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [textEditBook, setTextEditBook] = useState(null);
  const [bookText, setBookText] = useState("");
  const [pages, setPages] = useState([""]);
  const [currentPage, setCurrentPage] = useState(0);
  const saveTimeout = useRef(null);

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
    setTextEditBook(book);
    let textPages =
      book.pages && book.pages.length > 0
        ? book.pages.map((p) => p.content)
        : [""];
    setPages(textPages);
    setCurrentPage(0);
    setShowTextEditor(true);
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

  const handleDeleteBook = (book) => {
    setDeleteBookId(book.id);
    setDeleteBookTitle(book.title);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteBook = async () => {
    try {
      await axios.post(
        "http://localhost/api/book_delete.php",
        { id: deleteBookId },
        { withCredentials: true }
      );
      setShowDeleteConfirm(false);
      setDeleteBookId(null);
      setDeleteBookTitle("");
      await fetchBooks();
    } catch (err) {
      alert("Ошибка при удалении книги");
    }
  };

  const cancelDeleteBook = () => {
    setShowDeleteConfirm(false);
    setDeleteBookId(null);
    setDeleteBookTitle("");
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

  const handleSaveBookText = async () => {
    try {
      await axios.post(
        "http://localhost/api/book_text_edit.php",
        {
          id: textEditBook.id,
          text: pages[currentPage],
        },
        { withCredentials: true }
      );
      setShowTextEditor(false);
      setTextEditBook(null);
      setBookText("");
      await fetchBooks();
    } catch (err) {
      alert("Ошибка при сохранении текста книги");
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    let newPages = [...pages];
    newPages[currentPage] = newText;
    setPages(newPages);
    // Автосохранение с debounce
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveBookText(newPages), 1000);
  };

  const handleAddPage = () => {
    const newPages = [...pages, ""];
    setPages(newPages);
    setCurrentPage(newPages.length - 1);
  };

  const handleCloseTextEditor = () => {
    // Удаляем все пустые страницы, кроме первой
    let newPages = pages.filter((p, i) => p.trim().length > 0 || i === 0);
    if (newPages.length === 0) newPages = [""];
    setPages(newPages);
    saveBookText(newPages); // сохраняем изменения
    setShowTextEditor(false);
    setTextEditBook(null);
    setBookText("");
  };

  const saveBookText = async (pagesToSave) => {
    try {
      await axios.post(
        "http://localhost/api/book_text_edit.php",
        {
          id: textEditBook.id,
          text: pagesToSave.join("\n\n"),
        },
        { withCredentials: true }
      );
    } catch (err) {
      // Можно добавить уведомление об ошибке
    }
  };

  const handlePageNav = (dir) => {
    setCurrentPage((prev) => {
      let next = prev + dir;
      if (next < 0) next = 0;
      if (next > pages.length - 1) next = pages.length - 1;
      return next;
    });
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
            <div
              className="book-info"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div>
                <h2 className="book-title" style={{ marginBottom: 0 }}>
                  {book.title}
                </h2>
                <p className="book-author">Автор: {book.author}</p>
                <p className="book-description">{book.description}</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 0 }}>
                <button
                  className="edit-book-btn"
                  onClick={(e) => {
                    e.stopPropagation();
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBook(book);
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
        <div className="add-book-form" style={{ position: "relative" }}>
          <button
            className="close-button"
            onClick={() => setShowAddBookForm(false)}
            style={{ position: "absolute", top: 18, right: 18, zIndex: 10 }}
          >
            ×
          </button>
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
        </div>
      </Modal>

      <Modal
        isOpen={showEditBookForm}
        onClose={() => setShowEditBookForm(false)}
        className="modal-add-book"
      >
        <div
          className="add-book-form"
          style={{
            position: "relative",
            maxWidth: "900px",
            width: "90vw",
            minHeight: 420,
          }}
        >
          <button
            className="close-button"
            onClick={() => setShowEditBookForm(false)}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#f6faff",
              border: "1.5px solid #dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#888",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <FaTimes />
          </button>
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
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={cancelDeleteBook}
        className="modal-add-book"
      >
        <div
          className="add-book-form"
          style={{ textAlign: "center", maxWidth: 340 }}
        >
          <h2 style={{ color: "#e74c3c" }}>Удалить книгу?</h2>
          <p style={{ marginBottom: 24 }}>
            Вы действительно хотите удалить книгу <b>"{deleteBookTitle}"</b>?
            Это действие нельзя отменить.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={confirmDeleteBook}
              style={{
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "0.7rem 2.2rem",
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              Удалить
            </button>
            <button
              onClick={cancelDeleteBook}
              style={{
                background: "#f6faff",
                color: "#222",
                border: "1.5px solid #dbeafe",
                borderRadius: 8,
                padding: "0.7rem 2.2rem",
                fontWeight: 500,
                fontSize: "1.1rem",
                cursor: "pointer",
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTextEditor}
        onClose={handleCloseTextEditor}
        className="modal-add-book text-editor-modal"
        closeOnOverlayClick={false}
      >
        <div
          className="add-book-form"
          style={{
            maxWidth: "90vw",
            width: "90vw",
            height: "90vh",
            minHeight: 500,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            boxSizing: "border-box",
            padding: "2.5rem 2.5rem 2rem 2.5rem",
          }}
        >
          <button
            className="close-button"
            onClick={handleCloseTextEditor}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#f6faff",
              border: "1.5px solid #dbeafe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#888",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            <FaTimes />
          </button>
          <h2 style={{ fontSize: "2.2rem", marginBottom: 24 }}>Текст книги</h2>
          <div
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="page-nav-panel">
              <div className="page-nav-controls">
                <button
                  onClick={() => handlePageNav(-1)}
                  disabled={currentPage === 0}
                  className="page-nav-btn"
                  style={{
                    fontSize: 22,
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    border: "none",
                    background: "#e4e8eb",
                    color: "#3498db",
                    cursor: currentPage === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  &lt;
                </button>
                <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  Страница {currentPage + 1} из {pages.length}
                </span>
                <button
                  onClick={() => handlePageNav(1)}
                  disabled={currentPage === pages.length - 1}
                  className="page-nav-btn"
                  style={{
                    fontSize: 22,
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    border: "none",
                    background: "#e4e8eb",
                    color: "#3498db",
                    cursor:
                      currentPage === pages.length - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  &gt;
                </button>
              </div>
              <div className="add-page-panel">
                <span className="add-page-label">Добавить страницу</span>
                <button
                  onClick={handleAddPage}
                  title="Создать страницу"
                  className="add-page-btn"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <textarea
              className="editor-textarea"
              value={pages[currentPage]}
              onChange={handleTextChange}
              placeholder="Введите или измените текст книги..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BooksPage;
