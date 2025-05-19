import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
// import backgroundImage from '../whale-background.png'; // Больше не нужно импортировать сюда

function Home() {
  const secondSectionRef = useRef(null);

  const scrollToSecondSection = () => {
    secondSectionRef.current.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // Определяем структуру заголовка: две строки, сгруппированные по словам
  const titleStructure = [["Book"], ["And", "Books"]]; 

  // const lines = ["Book", "And Books"]; // Удаляем эту строку
  // const words = ["Book", "And", "Books"]; // Удаляем эту строку
  // const fullTitle = "BookAndBooks"; // Удаляем эту строку

  // const sectionStyle = { // Больше не нужно
  //   backgroundImage: `url(${backgroundImage})`,
  // };

  // Удаляем useEffect hook, так как z-index и transition будут установлены инлайн
  // useEffect(() => {
  //   const letters = document.querySelectorAll('.letter');
  //   letters.forEach((letter, index) => {
  //     letter.style.zIndex = `${index}`; /* Изменен z-index на положительный */
  //     letter.style.transitionDuration = `${index / 5 + 1}s`;
  //   });
  // }, []); // Пустой массив зависимостей означает, что эффект запустится один раз после монтирования

  return (
    <div className="home-page">
      <section className="home-section home-section-one"> {/* Первая секция */}
        <div className="home-section-inner"> {/* Новый внутренний контейнер */}
          <div className="content">
            <h1 className="title">
              <div className="letters"> {/* Контейнер для стилей букв */}
                {titleStructure.map((line, lineIndex) => (
                  <div key={lineIndex}> {/* Контейнер для каждой строки */}
                    {line.map((word, wordIndex) => (
                      <React.Fragment key={`${lineIndex}-${wordIndex}`}> {/* Fragment для группировки слов в строке */}
                        {word.split('').map((letter, letterIndex) => (
                          <span 
                            key={`${lineIndex}-${wordIndex}-${letterIndex}`} 
                            className="letter" 
                            style={{
                              '--index': letterIndex, /* z-index на основе индекса буквы в слове */
                              zIndex: letterIndex, /* z-index на основе индекса буквы в слове */
                              transitionDuration: `${letterIndex / 5 + 1}s` /* transition-duration на основе индекса буквы в слове */
                            }}
                          >{letter}</span>
                        ))}
                        {/* Добавляем пробел между словами, если это не последнее слово в строке */}
                        {wordIndex < line.length - 1 && ' '}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </h1>
            <button onClick={scrollToSecondSection}>Начать чтение</button>
          </div>
        </div>
      </section>

      <section ref={secondSectionRef} className="home-section home-section-two"> {/* Вторая секция */}
        <div className="home-section-inner"> {/* Новый внутренний контейнер */}
          <div className="content">
            <p>Книги - это корабли мысли, странствующие по волнам времени и бережно несущие свой драгоценный груз от поколения к поколению.</p>
            <p>У вас уже есть аккаунт? <Link to="/login">Войти</Link></p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 