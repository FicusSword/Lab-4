import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

interface Anime {
  id: number;
  title: string;
  image: string;
}

interface ScheduleItem {
  id: number;
  animeTitle: string;
  dayOfWeek: string;
  time: string;
  episode: string;
}

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAY_EN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// js Date: 0=Вс,1=Пн,...,6=Сб
const JS_DAY_TO_INDEX = [6, 0, 1, 2, 3, 4, 5];
const todayIndex = JS_DAY_TO_INDEX[new Date().getDay()];

function Schedule() {
  const [activeDay, setActiveDay] = useState(todayIndex);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    fetch('/api/schedule')
      .then(r => r.json())
      .then(setScheduleData)
      .catch(() => {});
  }, []);

  const items = scheduleData
    .filter(s => s.dayOfWeek === DAY_EN[activeDay])
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="schedule-wrap">
      <div className="schedule-days">
        {DAYS.map((day, i) => (
          <button
            key={day}
            className={`schedule-day-btn${i === activeDay ? " active" : ""}${i === todayIndex ? " today" : ""}`}
            onClick={() => setActiveDay(i)}
          >
            {day}
            {i === todayIndex && <span className="today-dot" />}
          </button>
        ))}
      </div>

      <div className="schedule-list">
        {items.length === 0 ? (
          <p className="schedule-empty">В этот день выходов нет</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="schedule-item">
              <span className="schedule-time">{item.time}</span>
              <div className="schedule-info">
                <span className="schedule-title">{item.animeTitle}</span>
                {item.episode && <span className="schedule-episode">{item.episode}</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function MainPage() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const navigate = useNavigate();

  const randomPhrases = [
    "Найди своё новое любимое аниме",
    "Откройте миры бесконечных приключений",
    "Начните эпическое путешествие прямо сейчас",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % randomPhrases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [randomPhrases.length]);

  const demoAnimes: Anime[] = [
    { id: 1, title: "Судьба/Странная подделка", image: "https://img.cdngos.com/anime/69/69b0592904754519432210" },
    { id: 2, title: "Fate/Stay Night",           image: "https://img.cdngos.com/anime/69/698ef80fb9fc9713696516" },
    { id: 3, title: "Судьба/Странная подделка", image: "https://img.cdngos.com/anime/69/69b0592904754519432210" },
    { id: 4, title: "Fate/Stay Night",           image: "https://img.cdngos.com/anime/69/698ef80fb9fc9713696516" },
    { id: 5, title: "Судьба/Странная подделка", image: "https://img.cdngos.com/anime/69/69b0592904754519432210" },
    { id: 6, title: "Fate/Stay Night",           image: "https://img.cdngos.com/anime/69/698ef80fb9fc9713696516" },
  ];


  return (
    <div className="mainpage-wrap">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-subtitle animated-phrase">{randomPhrases[phraseIndex]}</p>
          <div className="hero-gradient"></div>
        </div>
      </section>

      <Container fluid className="mainpage-container">
        {/* Продолжить просмотр */}
        <section className="featured-section">
          <div className="featured-header">
            <h2 className="section-title">Продолжить просмотр</h2>
            <div className="title-underline"></div>
          </div>
          <div className="featured-anime">
            <div
              className="featured-card"
              onClick={() => navigate(`/catalog/${demoAnimes[0]?.id}`)}
            >
              <div className="featured-image-wrapper">
                <img src={demoAnimes[0]?.image} alt={demoAnimes[0]?.title} className="featured-image" />
                <div className="featured-badge">TOP</div>
              </div>
              <div className="featured-info">
                <h3 className="featured-title">{demoAnimes[0]?.title}</h3>
                <div className="featured-meta">
                  <span className="meta-item">8.5 рейтинг</span>
                  <span className="meta-item">2026 год</span>
                </div>
                <p className="featured-description">
                  Война за Святой Грааль начинается в городе Сноуфилд, где необычные герои сражаются за силу, превосходящую всё.
                </p>
                <div className="featured-genres">
                  <span className="genre-tag">Фэнтези</span>
                  <span className="genre-tag">Экшен</span>
                  <span className="genre-tag">Приключения</span>
                </div>
                <button className="featured-btn">Смотреть сейчас →</button>
              </div>
            </div>
          </div>
        </section>

        {/* Новинки */}
        <section className="mainpage-section">
          <div className="section-header">
            <h2 className="section-title">Новинки каталога</h2>
            <div className="title-underline"></div>
          </div>
          <div className="anime-cards-grid">
            {demoAnimes.map((anime) => (
              <div
                key={anime.id}
                className="anime-card"
                onClick={() => navigate(`/catalog/${anime.id}`)}
              >
                <div className="card-image-wrapper">
                  <img src={anime.image} alt={anime.title} className="anime-card-image" />
                  <div className="card-rating">8.5</div>
                </div>
                <div className="anime-card-overlay">
                  <h5 className="anime-card-title">{anime.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Расписание */}
        <section className="mainpage-section">
          <div className="section-header">
            <h2 className="section-title">Расписание выхода</h2>
            <div className="title-underline"></div>
          </div>
          <Schedule />
        </section>

        {/* Нижний блок */}
        <section className="bottom-section">
          <div className="bottom-content">
            <h3>Готов к новым приключениям?</h3>
            <p>Откройте для себя тысячи аниме с уникальными сюжетами и персонажами</p>
            <button className="explore-btn" onClick={() => navigate("/catalog")}>
              Исследовать каталог
            </button>
          </div>
        </section>
      </Container>
    </div>
  );
}
