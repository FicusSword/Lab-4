import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import KodikPlayer from "../KodikPlayer/KodikPlayer";
import "./CatalogDetail.css";

interface Episode {
  id: number;
  number: number;
  title: string;
  videoUrl: string;
}

interface AnimeDetail {
  id: number;
  title: string;
  image: string;
  year: number;
  rating: number;
  description: string;
  episodes: Episode[];
  genres: string[];
}

export function CatalogDetail() {
  const { animeId } = useParams<{ animeId: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [panelOffset, setPanelOffset] = useState(0);

  const getEpisodesPerPage = () => {
    const w = window.innerWidth;
    if (w >= 1400) return 14;
    if (w >= 1200) return 12;
    if (w >= 992)  return 10;
    if (w >= 768)  return 7;
    if (w >= 480)  return 5;
    return 4;
  };
  const [episodesPerPage, setEpisodesPerPage] = useState(getEpisodesPerPage());

  useEffect(() => {
    const handleResize = () => setEpisodesPerPage(getEpisodesPerPage());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Демо данные - потом будут браться из API
    const demoAnimes: { [key: string]: AnimeDetail } = {
      "1": {
        id: 1,
        title: "Приговорённый быть героем",
        image: "https://img.cdngos.com/anime/69/694b1b1b30047817089986",
        year: 2026,
        rating: 8.5,
        description: "Обычно героем называют того, кто в решающий момент находит в себе силы пожертвовать собой ради других. Для этого требуется отвага и благородство — но только не в этом мире. Здесь звание героя получают вовсе не за подвиги, а за тяжкие преступления, достаточные для отправки в специальный карательный корпус. Оказавшись в так называемом «геройском отряде», осуждённые лишаются выбора и обязаны нести военную службу, вступая в бой с войсками Короля демонов. Даже гибель не становится для них освобождением: павших воскрешают и снова бросают в сражение.\n\nКсайло Форбарц, некогда возглавлявший Орден святых рыцарей, также совершил непростительный поступок и был зачислен в отряд под номером 9004. Теперь он бок о бок с другими преступниками выполняет приказы командования, стараясь сохранить силу духа. Судьба сводит его с загадочной девочкой по имени Теоритта — существом, которое нельзя назвать человеком, ведь она является живым оружием и обладает огромной мощью. К чему приведёт эта встреча и как она отразится на будущем всего мира?",
        genres: ["Фэнтези", "Экшен", "Приключения"],
        episodes: [
          { id: 1, number: 1, title: "Начало", videoUrl: "https://kodik.info/seria/1557398/cbf4ebfac4f4016720f07c2a0a89e321/720p" },
          { id: 2, number: 2, title: "Приключения", videoUrl: "https://kodik.info/seria/1560087/f31d6b91477ac079b0bcc5547b1b3d6d/720p" },
          { id: 3, number: 3, title: "Тайна", videoUrl: "https://kodik.info/seria/1562397/1ad290edcfc0c3391a09698dc7afdc8e/720p" },
          { id: 4, number: 4, title: "Конфликт", videoUrl: "https://kodik.info/seria/1565287/81643ba03e68850d365016b023902164/720p" },
          { id: 5, number: 5, title: "Разоблачение", videoUrl: "https://kodik.info/seria/1568430/770ee1d4032aa5b346b142f966e80798/720p" },
          { id: 6, number: 6, title: "Финал", videoUrl: "https://kodik.info/seria/1571472/aa7fbed4933f3312ca5aa61f9bc0efa7/720p" },
          { id: 7, number: 7, title: "Серия 7", videoUrl: "https://kodik.info/seria/1574329/7ea04a2f9d7b17b27039cf9e363ecff0/720p" },
          { id: 8, number: 8, title: "Серия 8", videoUrl: "https://kodik.info/seria/1577393/4f452e14b20c12d38604730a275218d5/720p" },
          { id: 9, number: 9, title: "Серия 9", videoUrl: "https://kodik.info/seria/1579471/6819fd0d6bf1f6fbab94ba73f7ca7a73/720p" },
        ],
      },
      "2": {
        id: 2,
        title: "Демо Сериал 2",
        image: "https://img.cdngos.com/anime/69/694b18d8d8f1c698014324",
        year: 2022,
        rating: 7.8,
        description: "Увлекательный сериал с неожиданными поворотами сюжета.",
        genres: ["Романтика", "Комедия"],
        episodes: [
          { id: 1, number: 1, title: "Встреча", videoUrl: "https://kodik.info/video/108239/22cee55cda5760e2a86ed8549a4400e5/720p" },
          { id: 2, number: 2, title: "Встреча", videoUrl: "https://kodik.info/seria/1402677/0903d489ae6aca4ab089b308c0a20136/720p" },
          { id: 3, number: 3, title: "Тренировка", videoUrl: "https://kodik.info/seria/1557926/953bfac744dbe6ed5cefe7f5e0ee1f2f/720p" },
          { id: 4, number: 4, title: "Испытание", videoUrl: "https://kodik.info/seria/1560618/8cbcb87b3f6a76926ea735a99834a0fd/720p" },
          { id: 5, number: 5, title: "Победа", videoUrl: "https://kodik.info/seria/1563561/9707fe84b3d1acceb53407a6e6310b16/720p" },
          { id: 6, number: 6, title: "Серия 5", videoUrl: "https://kodik.info/seria/1566040/79410a340fa7f6183c082ee9d0017124/720p" },
          { id: 7, number: 7, title: "Серия 6", videoUrl: "https://kodik.info/seria/1569864/f827cab1d59c2402b8bbb02f357dd468/720p" },
          { id: 8, number: 8, title: "Серия 7", videoUrl: "https://kodik.info/seria/1572620/3e79385fc201074c7a63cd3f8197a4fd/720p" },
          { id: 9, number: 9, title: "Серия 8", videoUrl: "https://kodik.info/seria/1578538/00641e6b27503a8e2317255e0c8a28c9/720p" },
          { id: 10, number: 10, title: "Серия 9", videoUrl: "https://kodik.info/seria/1578721/c4c2896dfd0890c3df8f771e2fa29f1c/720p" },
          { id: 11, number: 11, title: "Серия 10", videoUrl: "https://kodik.info/seria/1580269/b402850e19e418095697a73e04821934/720p" },
        ],
      },
    };

    const selectedAnime = demoAnimes[animeId || "1"];
    if (selectedAnime) {
      setAnime(selectedAnime);
      
      // Загружаем сохраненную серию из LocalStorage
      const savedEpisode = localStorage.getItem(`anime_${animeId}_episode`);
      const episodeNum = savedEpisode ? parseInt(savedEpisode) : 1;
      setSelectedEpisode(episodeNum);
      
      // Высчитываем нужный offset для панели
      const offset = Math.max(0, Math.floor((episodeNum - 1) / episodesPerPage));
      setPanelOffset(offset);
    }
    setLoading(false);
  }, [animeId]);

  // Сохраняем выбранную серию в LocalStorage
  const handleEpisodeSelect = (episodeNum: number) => {
    setSelectedEpisode(episodeNum);
    localStorage.setItem(`anime_${animeId}_episode`, episodeNum.toString());
    
    // Обновляем offset если нужно
    const newOffset = Math.max(0, Math.floor((episodeNum - 1) / episodesPerPage));
    setPanelOffset(newOffset);
  };

  const handleWatchTogether = () => {
    alert(`Начинаем совместный просмотр серии ${selectedEpisode} "${anime?.episodes[selectedEpisode - 1]?.title}"`);
  };

  const handlePanelMove = (direction: 'left' | 'right') => {
    const maxOffset = Math.ceil((anime?.episodes.length || 1) / episodesPerPage) - 1;
    
    if (direction === 'left') {
      setPanelOffset(Math.max(0, panelOffset - 1));
    } else {
      setPanelOffset(Math.min(maxOffset, panelOffset + 1));
    }
  };

  if (loading) {
    return <div className="text-white mt-5">Загрузка...</div>;
  }

  if (!anime) {
    return (
      <Container className="my-5">
        <Button onClick={() => navigate("/catalog")}>← Вернуться в каталог</Button>
        <div className="text-white mt-3">Сериал не найден</div>
      </Container>
    );
  }

  const startIdx = panelOffset * episodesPerPage;
  const endIdx = startIdx + episodesPerPage;
  const visibleEpisodes = anime.episodes.slice(startIdx, endIdx);
  const maxOffset = Math.ceil(anime.episodes.length / episodesPerPage) - 1;

  return (
    <Container fluid className="catalog-detail-container-new p-0">
      {/* Основной контент: слева инфо, справа плеер */}
      <Container fluid className="main-content-wrapper">
        <Row className="h-100" style={{ display: "flex", alignItems: "flex-start", gap: "24px", margin: 0 }}>
          {/* Левая панель - информация о сериале */}
          <Col lg={5} className="left-panel" style={{ alignSelf: "flex-start" }}>
            <div className="anime-info-card">
              <img src={anime.image} alt={anime.title} />
              <div className="info-content">
                <h5 className="card-title">{anime.title}</h5>
                <div className="anime-meta">
                  <p className="meta-item">
                    <strong>Год:</strong> {anime.year}
                  </p>
                  <div className="meta-item genres-item">
                    <strong>Жанры:</strong>
                    <div className="genres-list">
                      {anime.genres.map((genre) => (
                        <span key={genre} className="genre-tag">{genre}</span>
                      ))}
                    </div>
                  </div>
                  <p className="meta-item">
                    <strong>Серий:</strong> {anime.episodes.length}
                  </p>
                  <p className="meta-item">
                    <strong>Рейтинг:</strong> <span className="rating">⭐ {anime.rating}</span>
                  </p>
                  <p className="meta-item">
                    <strong>Длительность: 24 мин. ~ серия</strong>
                  </p>
                  <p className="meta-item">
                    <strong>Возрастной рейтинг: 18+</strong>
                  </p>
                  <p className="meta-item">
                    <strong>Режисёр: Такахито Сакадзумэ, Сюн Энокидо</strong>
                  </p>
                  <p className="meta-item">
                    <strong>Автор оригинала: Рёго Нарита</strong>
                  </p>
                </div>
              </div>
              <p className="anime-description">{anime.description}</p>
            </div>
          </Col>

          {/* Правая панель - плеер и контролы */}
          <Col lg={7} className="right-panel" style={{ marginTop: 0, paddingTop: 0 }}>
            {/* Плеер */}
            <div className="player-wrapper-main">
              <KodikPlayer
                videoUrl={anime.episodes[selectedEpisode - 1]?.videoUrl || ""}
              />
            </div>

            {/* Контролы под плеером */}
            <div className="controls-under-player">
              {/* Горизонтальная панель с номерами серий */}
              <div className="episodes-panel-wrapper">
                <button
                  className="panel-arrow panel-arrow-left"
                  onClick={() => handlePanelMove('left')}
                  disabled={panelOffset === 0}
                >
                  ←
                </button>

                <div className="episodes-panel">
                  {visibleEpisodes.map((ep) => (
                    <button
                      key={ep.id}
                      className={`episode-panel-btn ${selectedEpisode === ep.number ? "active" : ""}`}
                      onClick={() => handleEpisodeSelect(ep.number)}
                      title={ep.title}
                    >
                      {ep.number}
                    </button>
                  ))}
                </div>

                <button
                  className="panel-arrow panel-arrow-right"
                  onClick={() => handlePanelMove('right')}
                  disabled={panelOffset >= maxOffset}
                >
                  →
                </button>
              </div>

              {/* Инфо о текущей серии */}
              <div className="current-episode-info">
                Серия {selectedEpisode}: {anime.episodes[selectedEpisode - 1]?.title}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}