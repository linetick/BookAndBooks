import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const TestAccountLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTestAccount = () => {
    // Устанавливаем тестовые данные
    const testUser = {
      id: 1,
      login: 'test',
      email: 'test@test.com'
    };

    // Выполняем вход
    login();
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(testUser));
    navigate("/", { state: { justLoggedIn: true } });
  };

  return (
    <button 
      onClick={handleTestAccount}
      className="test-account-button"
    >
      Войти с тестовым аккаунтом
    </button>
  );
}; 