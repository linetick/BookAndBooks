// components/Header.js
import { Link } from "react-router-dom";
const Header = () => (
  <header className="books-header">
    <Link to="/" className="logo">
      BookAndBooks
    </Link>
    <div className="header-buttons">
      <button
        className="profile-button"
        onClick={() => {
          window.location.href = "/profile";
        }}
      >
        👤
      </button>
    </div>
  </header>
);
export default Header;
