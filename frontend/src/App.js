import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import BooksPage from "./BooksPage";
import MyBooksPage from "./pages/MyBooksPage";
import "./App.css";


function App() {
  return (
    <Router>
      <div className="App">
        {/* Removed old navigation */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/mybooks" element={<MyBooksPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
