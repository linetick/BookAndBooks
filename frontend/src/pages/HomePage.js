import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import '../App.css';
import { ThemeToggle, ProfileButton } from "../components";

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // refs for scroll
  const whyRef = useRef(null);
  const storyRef = useRef(null);
  const howRef = useRef(null);

  // Check authentication status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleScrollTo = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleProfileClick = () => {
    // Placeholder for profile click logic
    console.log('Profile button clicked');
  };

  return (
    <div className="home-page">
      <header className="header" style={{gap: 24}}>
        <Link to="/" className="logo">BookAndBooks</Link>
        <nav style={{display: 'flex', gap: 16}}>
          <button className="nav-button" style={{minWidth:120}} onClick={() => handleScrollTo(whyRef)}>Почему мы</button>
          <button className="nav-button" style={{minWidth:120}} onClick={() => handleScrollTo(storyRef)}>Наша история</button>
          <button className="nav-button" style={{minWidth:120}} onClick={() => handleScrollTo(howRef)}>Как это работает</button>
        </nav>
      </header>

      <section className="home-section" style={{paddingTop: 80}}>
        <h1>Добро пожаловать в BookAndBooks</h1>
        <p>
          Ваш персональный портал в мир литературы. Здесь вы найдете тысячи книг,
          сможете создавать свои коллекции и делиться впечатлениями с другими читателями.
        </p>
        <button className="nav-button" onClick={() => navigate('/books')}>Начать чтение</button>
      </section>

      <section className="home-section" ref={whyRef}>
        <h2>Почему BookAndBooks?</h2>
        <div className="features">
          <div className="feature">
            <i className="fas fa-book"></i>
            <h3>Богатая библиотека</h3>
            <p>Доступ к тысячам книг различных жанров</p>
          </div>
          <div className="feature">
            <i className="fas fa-users"></i>
            <h3>Сообщество читателей</h3>
            <p>Общайтесь с единомышленниками и делитесь впечатлениями</p>
          </div>
          <div className="feature">
            <i className="fas fa-bookmark"></i>
            <h3>Персональные коллекции</h3>
            <p>Создавайте свои подборки и сохраняйте любимые книги</p>
          </div>
          <div className="feature">
            <i className="fas fa-lightbulb"></i>
            <h3>Умные рекомендации</h3>
            <p>Персонализированные советы на основе ваших интересов</p>
          </div>
          <div className="feature">
            <i className="fas fa-mobile-alt"></i>
            <h3>Доступ с любого устройства</h3>
            <p>Читайте книги на телефоне, планшете или компьютере</p>
          </div>
          <div className="feature">
            <i className="fas fa-lock"></i>
            <h3>Безопасность и приватность</h3>
            <p>Ваши данные и коллекции надежно защищены</p>
          </div>
        </div>
      </section>

      <section className="home-section" ref={storyRef}>
        <h2>Наша история</h2>
        <p style={{maxWidth: 800, margin: '0 auto', fontSize: '1.1rem'}}>
          Однажды, в маленьком городе, несколько друзей собрались за чашкой чая и поделились мечтой — создать место, где каждая книга найдёт своего читателя, а каждый читатель — свою книгу. Так родился BookAndBooks.
          <br /><br />
          Мы начинали с нескольких полок любимых романов и энтузиазма, который согревал нас в самые холодные вечера. С годами наш проект рос, как дерево, пуская корни в сердца тысяч людей. Мы верим, что каждая история способна изменить мир, а чтение объединяет поколения и континенты.
          <br /><br />
          Сегодня BookAndBooks — это не просто библиотека. Это сообщество, где вдохновение рождается из страниц, а дружба — из общих впечатлений. Мы гордимся тем, что вместе с вами пишем новую главу в истории любви к книгам.
        </p>
        <div style={{display:'flex', justifyContent:'center', gap:32, marginTop:32, flexWrap:'wrap'}}>
          <div className="feature">
            <i className="fas fa-seedling"></i>
            <h3>2019</h3>
            <p>Запуск первой версии сайта</p>
          </div>
          <div className="feature">
            <i className="fas fa-users"></i>
            <h3>2021</h3>
            <p>Достигли 10 000 пользователей</p>
          </div>
          <div className="feature">
            <i className="fas fa-globe"></i>
            <h3>2023</h3>
            <p>Появились пользователи из других стран</p>
          </div>
        </div>
      </section>

      <section className="home-section" ref={howRef}>
        <h2>Как это работает?</h2>
        <div style={{maxWidth: 900, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.7}}>
          <ol style={{paddingLeft: 24}}>
            <li>Регистрируйтесь на сайте или входите в свой аккаунт.</li>
            <li>Выбирайте книги из нашей библиотеки или добавляйте свои.</li>
            <li>Создавайте коллекции, читайте онлайн, делитесь отзывами.</li>
            <li>Получайте рекомендации и находите новых друзей по интересам.</li>
            <li>Следите за обновлениями и участвуйте в конкурсах для читателей!</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 