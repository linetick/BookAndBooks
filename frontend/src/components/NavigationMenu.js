import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const baseMenuItems = [
  { to: "/", label: "Главная", icon: "🏠" },
  { to: "/books", label: "Книги", icon: "📚" },
];

const authItems = [
  { to: "/mybooks", label: "Мои книги", icon: "📖", auth: true },
  { to: "/profile", label: "Профиль", icon: "👤", auth: true },
  { to: "/login", label: "Войти", icon: "🔑", auth: false },
  { to: "/register", label: "Регистрация", icon: "📝", auth: false },
];

const themes = [
  { name: "light", icon: "🌞" },
  { name: "dark", icon: "🌙" },
  { name: "nature", icon: "🌿" },
  { name: "ocean", icon: "🌊" },
];

const NavigationMenu = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const currentIndex = themes.findIndex(t => t.name === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].name);
  };

  // Стили для меню
  const menuStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: open ? 220 : 56,
    background: 'var(--card-bg, #f5f5f5)',
    borderRight: '1px solid var(--card-shadow, #e0e0e0)',
    paddingTop: 60, // чуть меньше, чтобы хватало места
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    boxShadow: '2px 0 8px var(--card-shadow, #e0e0e0)',
    transition: 'width 0.2s cubic-bezier(.4,0,.2,1)',
    overflow: 'hidden',
  };

  const linkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 18px',
    color: active ? 'var(--accent-color, #3498db)' : 'var(--text-primary, #222)',
    background: active ? 'var(--bg-secondary, #e4e8eb)' : 'transparent',
    borderRadius: 12,
    fontWeight: 500,
    fontSize: 16,
    textDecoration: 'none',
    transition: 'background 0.2s',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const iconStyle = {
    fontSize: 22,
    minWidth: 22,
    textAlign: 'center',
  };

  // Получаем иконку текущей темы
  const currentThemeIcon = themes.find(t => t.name === theme)?.icon || "🎨";

  // Формируем итоговый список пунктов меню
  const menuItems = [
    ...baseMenuItems,
    ...authItems.filter(item => item.auth === undefined || item.auth === isAuthenticated)
  ];

  return (
    <nav
      className="side-menu"
      style={menuStyle}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={linkStyle(location.pathname === item.to)}
          >
            <span style={iconStyle}>{item.icon}</span>
            {open && <span>{item.label}</span>}
          </Link>
        ))}
        <button
          onClick={handleThemeToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '10px 18px',
            color: 'var(--text-primary, #222)',
            background: 'none',
            border: 'none',
            borderRadius: 12,
            fontWeight: 500,
            fontSize: 16,
            width: '100%',
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: 'none',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{fontSize: 22, minWidth: 22, textAlign: 'center'}}>{currentThemeIcon}</span>
          {open && <span>Сменить тему</span>}
        </button>
      </div>
      <div style={{flexGrow: 1}} />
    </nav>
  );
};

export default NavigationMenu; 