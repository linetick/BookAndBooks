import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./BooksPage.css";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {
    // Read theme from body attribute or localStorage
    return document.body.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Временное состояние для демонстрации
  const navigate = useNavigate();

  // Listen for theme changes (from menu or elsewhere)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.body.getAttribute('data-theme') || 'light';
      setTheme(newTheme);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    // Set initial theme
    setTheme(document.body.getAttribute('data-theme') || localStorage.getItem('theme') || 'light');
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Временные тестовые данные
    const testBooks = [
      {
        id: 1,
        title: "Тайны океана",
        author: "Анна Морская",
        cover_path:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
        description: "Захватывающая история о глубинах океана и его обитателях",
      },
      {
        id: 2,
        title: "Город мечты",
        author: "Максим Городской",
        cover_path:
          "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=60",
        description: "История о современном мегаполисе и его жителях",
      },
      {
        id: 3,
        title: "Звёздный путь",
        author: "Елена Космическая",
        cover_path:
          "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=60",
        description: "Фантастическое путешествие по просторам космоса",
      },
      {
        id: 4,
        title: "Лесные сказки",
        author: "Иван Лесной",
        cover_path:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60",
        description: "Волшебные истории о жизни лесных обитателей",
      },
      {
        id: 5,
        title: "Горные вершины",
        author: "Алексей Альпинист",
        cover_path:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60",
        description: "Приключения в мире высоких гор и их тайн",
      },
      {
        id: 6,
        title: "Пустынные тропы",
        author: "Мария Сахара",
        cover_path:
          "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&auto=format&fit=crop&q=60",
        description: "История о жизни в самом жарком месте на Земле",
      },
      {
        id: 7,
        title: "Арктические истории",
        author: "Пётр Северный",
        cover_path:
          "https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=800&auto=format&fit=crop&q=60",
        description: "Рассказы о жизни в царстве вечной мерзлоты",
      },
    ];

    // Тестовые страницы для книг
    const testPages = {
      1: [
        {
          page_number: 1,
          content:
            "Глава 1: Начало путешествия\n\nГлубоко в океане, где солнечный свет едва проникает сквозь толщу воды, начинается наша история. Здесь, в царстве вечной темноты, обитают удивительные создания, о которых большинство людей даже не подозревает.\n\nМорские глубины хранят множество тайн, и сегодня мы отправимся в путешествие, чтобы раскрыть некоторые из них.",
        },
        {
          page_number: 2,
          content:
            "Глава 1: Начало путешествия (продолжение)\n\nПервым существом, которое мы встретили, был гигантский кальмар. Его огромные глаза, размером с баскетбольный мяч, внимательно изучали нас. В темноте они светились, как два фонаря, освещая путь в глубины океана.\n\nЭто удивительное создание может достигать длины до 18 метров, что делает его одним из самых крупных беспозвоночных на планете.",
        },
        {
          page_number: 3,
          content:
            "Глава 2: Тайны глубин\n\nПогружаясь глубже, мы обнаружили целый город, построенный из кораллов. Здесь, в полной темноте, обитали тысячи различных видов рыб и других морских существ.\n\nКаждый уголок этого подводного мегаполиса был уникален и прекрасен по-своему. Яркие краски кораллов создавали невероятное зрелище, которое невозможно описать словами.",
        },
      ],
      2: [
        {
          page_number: 1,
          content:
            "Глава 1: Пробуждение города\n\nРаннее утро. Первые лучи солнца касаются небоскрёбов, окрашивая их в золотистые тона. Город просыпается, и его улицы постепенно наполняются жизнью.\n\nЛюди спешат на работу, кафе открывают свои двери, а уличные музыканты начинают свой день. Это обычное утро в большом городе, но каждый день здесь происходит что-то особенное.",
        },
        {
          page_number: 2,
          content:
            "Глава 1: Пробуждение города (продолжение)\n\nВ центре города, на главной площади, уже кипит жизнь. Уличные торговцы раскладывают свои товары, туристы фотографируют достопримечательности, а местные жители спешат по своим делам.\n\nАромат свежесваренного кофе смешивается с запахом выпечки из ближайшей пекарни. Это неповторимый запах утра, который делает город особенным.",
        },
      ],
      3: [
        {
          page_number: 1,
          content:
            "Глава 1: Первый шаг в космос\n\nЗвёзды мерцали в бескрайнем пространстве космоса, как миллионы крошечных маяков, указывающих путь к неизведанным мирам. Наш корабль, 'Звёздный странник', готовился к своему первому межгалактическому путешествию.\n\nЭкипаж из пяти человек проверял последние системы перед стартом. Каждый понимал важность этой миссии - мы были первыми, кто отважился отправиться так далеко от Земли.",
        },
        {
          page_number: 2,
          content:
            "Глава 1: Первый шаг в космос (продолжение)\n\nКогда двигатели заработали на полную мощность, корабль плавно оторвался от поверхности космодрома. Через иллюминаторы мы наблюдали, как Земля становилась всё меньше и меньше, пока не превратилась в крошечную голубую точку в бескрайнем пространстве.\n\nЭто был момент, который изменил нашу жизнь навсегда. Мы стали первыми людьми, отправившимися к звёздам.",
        },
      ],
      4: [
        {
          page_number: 1,
          content:
            "Глава 1: Лесное царство\n\nВ самом сердце древнего леса, где деревья достигают небес, а солнечные лучи едва пробиваются сквозь густую листву, начинается наша история. Здесь, в этом волшебном царстве, каждый день происходит что-то удивительное.\n\nСтарый дуб, который местные жители называют Хранителем леса, видел множество историй за свои тысячу лет жизни. И сегодня он готов поделиться с нами некоторыми из них.",
        },
        {
          page_number: 2,
          content:
            "Глава 1: Лесное царство (продолжение)\n\nПервая история рассказывает о дружбе маленького зайчонка и мудрой совы. Казалось бы, что может быть общего у таких разных существ? Но именно их необычная дружба помогла спасти лес от большой беды.\n\nСова, с её острым зрением и мудростью, и зайчонок, с его быстротой и храбростью, вместе смогли предупредить всех лесных жителей о приближающейся опасности.",
        },
      ],
      5: [
        {
          page_number: 1,
          content:
            "Глава 1: Вершина мира\n\nВысоко в горах, где воздух становится разреженным, а облака плывут ниже вершин, начинается наше путешествие. Здесь, среди вечных снегов и острых скал, человек чувствует себя маленьким и одновременно частью чего-то великого.\n\nАльпинисты называют эти места 'крышей мира'. И не зря - отсюда открывается вид на бескрайние просторы, которые простираются до самого горизонта.",
        },
        {
          page_number: 2,
          content:
            "Глава 1: Вершина мира (продолжение)\n\nВосхождение на вершину - это не просто физическое испытание. Это путь к самому себе, к пониманию своих возможностей и пределов. Каждый шаг вверх - это победа над страхом и сомнениями.\n\nНа высоте 8000 метров над уровнем моря, где содержание кислорода в воздухе в три раза меньше, чем внизу, каждый вдох становится драгоценным, а каждый момент - особенным.",
        },
      ],
      6: [
        {
          page_number: 1,
          content:
            "Глава 1: Песчаное море\n\nПустыня Сахара - это не просто огромное пространство песка. Это живой организм, который дышит, меняется и хранит множество тайн. Днём здесь невыносимая жара, а ночью температура может опуститься ниже нуля.\n\nНо даже в таких суровых условиях существует жизнь. Верблюды, скорпионы, змеи и множество других существ приспособились к жизни в этом экстремальном климате.",
        },
        {
          page_number: 2,
          content:
            "Глава 1: Песчаное море (продолжение)\n\nОазисы в пустыне - это как острова жизни в песчаном море. Здесь, среди пальм и прохладной воды, путники находят приют и отдых. Местные жители научились использовать каждый источник воды, каждое растение, каждое животное.\n\nИх мудрость, накопленная веками, помогает выживать в этом суровом краю. Они знают, как читать звёзды, как находить воду под песком, как предсказывать песчаные бури.",
        },
      ],
      7: [
        {
          page_number: 1,
          content:
            "Глава 1: Царство льда\n\nАрктика - это место, где природа демонстрирует свою силу и красоту в самых экстремальных формах. Здесь полярная ночь сменяется полярным днём, а температура может опускаться до -60 градусов.\n\nНо даже в таких условиях жизнь не просто существует - она процветает. Белые медведи, тюлени, моржи и множество других животных создали уникальную экосистему, которая существует в гармонии с суровым климатом.",
        },
        {
          page_number: 2,
          content:
            "Глава 1: Царство льда (продолжение)\n\nСеверное сияние - одно из самых удивительных явлений природы. Зелёные, синие и фиолетовые лучи танцуют в небе, создавая невероятное зрелище. Местные жители верят, что это духи предков играют в небесном шаре.\n\nЖизнь в Арктике требует особой выносливости и приспособляемости. Люди, которые здесь живут, научились не просто выживать, но и процветать в этих суровых условиях.",
        },
      ],
    };

    // Имитация загрузки данных
    setTimeout(() => {
      setBooks(testBooks);
      setLoading(false);
    }, 1000);

    // Сохраняем тестовые страницы в компоненте
    window.testPages = testPages;
  }, []);

  const fetchBooks = async () => {
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await axios.get('http://localhost:3001/api/books');
      // setBooks(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch books");
      setLoading(false);
    }
  };

  const fetchBookPages = async (bookId) => {
    try {
      // В реальном приложении здесь будет запрос к API
      // const response = await axios.get(`http://localhost:3001/api/books/${bookId}/pages`);
      // return response.data;
      return window.testPages[bookId] || [];
    } catch (err) {
      setError("Failed to fetch book pages");
      return [];
    }
  };

  const handleBookClick = async (book) => {
    const pages = await fetchBookPages(book.id);
    setSelectedBook({ ...book, pages });
    setCurrentPage(1);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < selectedBook.pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleMyBooksClick = () => {
    navigate("/my-books");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  if (loading) {
    return <div className="books-page">Loading...</div>;
  }

  if (error) {
    return <div className="books-page">{error}</div>;
  }

  return (
    <div className="books-page">
      <header className="header">
        <Link to="/" className="logo">BookAndBooks</Link>
      </header>
      <h1>Библиотека</h1>
      <div className="books-grid">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => handleBookClick(book)}
          >
            <img
              src={book.cover_path}
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
      </div>

      {selectedBook && (
        <div className="book-reader-modal">
          <div className="book-reader-content">
            <button className="close-button" onClick={handleCloseReader}>
              ×
            </button>
            <h2>{selectedBook.title}</h2>
            <p className="book-author">Автор: {selectedBook.author}</p>
            <div className="book-text">
              {selectedBook.pages[currentPage - 1]?.content}
            </div>
            <div className="page-navigation">
              <button
                className="page-button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Предыдущая страница
              </button>
              <span className="page-number">
                Страница {currentPage} из {selectedBook.pages.length}
              </span>
              <button
                className="page-button"
                onClick={handleNextPage}
                disabled={currentPage === selectedBook.pages.length}
              >
                Следующая страница
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
