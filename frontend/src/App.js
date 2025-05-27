import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import BooksPage from "./BooksPage";
import MyBooksPage from "./pages/MyBooksPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./AuthContext";
import "./App.css";
import Layout from "./components/Layout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="books" element={<BooksPage />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="mybooks" element={<MyBooksPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
