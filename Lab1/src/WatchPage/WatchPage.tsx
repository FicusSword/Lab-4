import React, { useState } from 'react';
import KodikPlayer from '../KodikPlayer/KodikPlayer';
import './WatchPage.css';

interface SearchResult {
  title: string;
  shikimori_id: string;
  type: string;
  year: string;
  status: string;
  studio: string;
  link: string;
}

const WatchPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string;
    id: string;
    type: 'shikimori' | 'kodik' | 'url';
  } | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>('');

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const response = await fetch(`http://localhost:3001/api/anime/search?q=${encodeURIComponent(searchInput)}`);
      const data = await response.json();

      if (data.success && data.results) {
        setSearchResults(data.results);
      } else {
        setSearchError(data.error || 'Не найдено результатов');
      }
    } catch (error) {
      setSearchError('Ошибка при поиске. Проверьте подключение к серверу.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectAnime = (result: SearchResult) => {
    setSelectedVideo({
      title: result.title,
      id: result.shikimori_id,
      type: 'shikimori'
    });
    setSearchResults([]); // Скрываем результаты после выбора
    setSearchInput(''); // Очищаем поле поиска
  };

  return (
    <div className="watch-page">
      <div className="watch-page-container">
        {/* HEADER */}
        <div className="watch-page-header">
          <h1>🎬 Watch Anime Together</h1>
          <p>Смотрите аниме вместе с друзьями в реальном времени</p>
        </div>

        {/* SEARCH SECTION */}
        <div className="watch-search-section">
          <div className="watch-search-box">
            <input
              type="text"
              placeholder="Введите название аниме (например: Naruto, Attack on Titan)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="watch-search-input"
            />
            <button onClick={handleSearch} className="watch-search-btn" disabled={isSearching}>
              {isSearching ? '🔄' : '🔍'} {isSearching ? 'Поиск...' : 'Поиск'}
            </button>
          </div>

          {/* SEARCH RESULTS */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Результаты поиска:</h3>
              <div className="results-list">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="result-item"
                    onClick={() => selectAnime(result)}
                  >
                    <div className="result-info">
                      <h4>{result.title}</h4>
                      <p>Тип: {result.type} | Год: {result.year} | Статус: {result.status}</p>
                      {result.studio && <p>Студия: {result.studio}</p>}
                    </div>
                    <button className="select-btn">Выбрать</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEARCH ERROR */}
          {searchError && (
            <div className="search-error">
              <p>❌ {searchError}</p>
            </div>
          )}

          {/* QUICK SUGGESTIONS */}
          <div className="watch-suggestions">
            <p>Популярные аниме:</p>
            <button
              onClick={() => selectAnime({ title: 'Naruto', shikimori_id: 'z20', type: 'TV', year: '2002', status: 'finished', studio: 'Pierrot', link: '' })}
              className="suggestion-btn"
            >
              Naruto
            </button>
            <button
              onClick={() => selectAnime({ title: 'Attack on Titan', shikimori_id: '430', type: 'TV', year: '2013', status: 'finished', studio: 'WIT,MAPPA', link: '' })}
              className="suggestion-btn"
            >
              Attack on Titan
            </button>
            <button
              onClick={() => selectAnime({ title: 'One Piece', shikimori_id: '5', type: 'TV', year: '1999', status: 'ongoing', studio: 'Toei Animation', link: '' })}
              className="suggestion-btn"
            >
              One Piece
            </button>
          </div>
        </div>

        {/* KODIK PLAYER */}
        {selectedVideo && (
          <KodikPlayer
            title={selectedVideo.title}
            shikimoriId={selectedVideo.type === 'shikimori' ? selectedVideo.id : undefined}
            kodikId={selectedVideo.type === 'kodik' ? selectedVideo.id : undefined}
            videoUrl={selectedVideo.type === 'url' ? selectedVideo.id : undefined}
            allowWatchTogether={true}
            roomId={`room-${selectedVideo.id}`}
          />
        )}

        {/* INFO SECTION */}
        <div className="watch-info-section">
          <h2>💡 Как это работает?</h2>
          <div className="watch-info-cards">
            <div className="info-card">
              <div className="info-icon">🔍</div>
              <h3>Поиск</h3>
              <p>Найдите необходимое аниме, используя поле поиска или быстрые предложения</p>
            </div>
            <div className="info-card">
              <div className="info-icon">▶️</div>
              <h3>Воспроизведение</h3>
              <p>Нажмите на видео и выберите озвучку, качество и нужную серию</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎬</div>
              <h3>Совместный просмотр</h3>
              <p>Нажмите кнопку "Смотреть вместе" и поделитесь ссылкой с друзьями</p>
            </div>
            <div className="info-card">
              <div className="info-icon">👥</div>
              <h3>Синхронизация</h3>
              <p>Все действия синхронизируются в реальном времени между зрителями</p>
            </div>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="watch-features-section">
          <h2>✨ Особенности</h2>
          <ul className="features-list">
            <li>✓ Встроенный плеер от Kodik</li>
            <li>✓ Поддержка тысяч аниме и фильмов</li>
            <li>✓ Совместный просмотр через WebSocket</li>
            <li>✓ Синхронизация в реальном времени</li>
            <li>✓ Множество озвучек и качеств</li>
            <li>✓ Работает на любом устройстве</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
