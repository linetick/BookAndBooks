import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const TestAccountLogin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleTestLogin = () => {
    localStorage.setItem('user', JSON.stringify({
      id: 'test_user_id',
      login: 'test_user',
      email: 'test@example.com'
    }));
    login();
    navigate('/', { state: { justLoggedIn: true } });
  };

  return (
    <button
      onClick={handleTestLogin}
      className="test-account-button"
      style={{
        background: 'var(--accent-color)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '16px',
        width: '100%',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      Войти с тестовым аккаунтом
    </button>
  );
};

export default TestAccountLogin; 