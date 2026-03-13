import React, { useEffect, useState } from 'react';
import './KodikPlayer.css';

interface Episode {
  number: number;
  title?: string;
}

interface AudioDub {
  id: string;
  name: string;
  language: string;
}

interface KodikPlayerProps {
  videoUrl?: string;
  shikimoriId?: string;
  kodikId?: string;
  title?: string;
  allowWatchTogether?: boolean;
  roomId?: string;
}

const KodikPlayer: React.FC<KodikPlayerProps> = ({
  videoUrl,
  shikimoriId,
  kodikId,
  title = " ",
  allowWatchTogether = false,
  roomId,
}) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [watchTogetherLink, setWatchTogetherLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [audios, setAudios] = useState<AudioDub[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');

  const getKodikLinks = async (episode?: number, translation?: string) => {
    if (!shikimoriId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/anime/kodik/${shikimoriId}/${episode || ''}/${translation || ''}`);
      const data = await response.json();

      if (data.success) {
        if (data.links.length > 0) {
          setCurrentVideoUrl(data.links[0].url);
        }
      } else {
        console.error('Ошибка получения Kodik ссылок:', data.error);
      }
    } catch (error) {
      console.error('Ошибка при запросе Kodik ссылок:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Формируем URL плеера в зависимости от переданных параметров
    let url = '';

    if (videoUrl) {
      // Если передан прямой URL видео
      url = videoUrl;
      setCurrentVideoUrl(url);
      setEmbedUrl(url);
    } else if (shikimoriId) {
      // Для демонстрации используем пример iframe ссылки
      // В реальности здесь должен быть вызов API для получения актуальных ссылок
      const exampleUrl = "https://kodik.info/seria/1402677/0903d489ae6aca4ab089b308c0a20136/720p";
      setCurrentVideoUrl(exampleUrl);

      setIsLoading(true);
      fetchVideoMetadata(shikimoriId);
    } else if (kodikId) {
      // Прямое встраивание видео с параметрами
      url = `https://kodik.info/embed/video/${kodikId}`;
      setCurrentVideoUrl(url);
      setEmbedUrl(url);
    }

    // Если включена функция совместного просмотра, формируем ссылку на комнату
    if (allowWatchTogether && roomId) {
      const watchTogetherUrl = `${window.location.origin}?watchRoom=${roomId}`;
      setWatchTogetherLink(watchTogetherUrl);
    }
  }, [videoUrl, shikimoriId, kodikId, allowWatchTogether, roomId]);

  const fetchVideoMetadata = async (shikId: string) => {
    try {
      // Получаем информацию только из Shikimori (без CORS проблем)
      const mockShikiData = {
        episodes: "220", // Пример для Naruto
        title: "Наруто",
        status: "вышло"
      };

      // Создаем episodes на основе количества серий
      const totalEpisodes = parseInt(mockShikiData.episodes) || 1;
      const episodeList: Episode[] = [];
      for (let i = 1; i <= Math.min(totalEpisodes, 50); i++) {
        episodeList.push({
          number: i,
          title: `Серия ${i}`,
        });
      }
      setEpisodes(episodeList);
      if (episodeList.length > 0) {
        setSelectedEpisode(episodeList[0].number);
      }

      // Только русские озвучки
      const dubList: AudioDub[] = [
        { id: "anilibria", name: "AniLibria", language: "RU" },
        { id: "anidub", name: "AniDUB", language: "RU" },
        { id: "2x2", name: "2x2", language: "RU" },
        { id: "shiza", name: "SHIZA Project", language: "RU" },
      ];
      setAudios(dubList);
      if (dubList.length > 0) {
        setSelectedAudio(dubList[0].id);
      }

      // Используем Kodik search page напрямую (без API)
      const fallbackUrl = `https://kodik.info/search?types=anime&shikimori_id=${shikId}`;
      setEmbedUrl(fallbackUrl);

    } catch (error) {
      console.error('Ошибка при загрузке метаданных:', error);
      const fallbackUrl = `https://kodik.info/search?types=anime&shikimori_id=${shikId}`;
      setEmbedUrl(fallbackUrl);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlayerUrl = (episodeNum: number, audioId: string) => {
    // Получаем Kodik ссылки для выбранной серии и озвучки
    setSelectedEpisode(episodeNum);
    setSelectedAudio(audioId);
    getKodikLinks(episodeNum, audioId);
  };

  const handleEpisodeChange = (episodeNum: number) => {
    setSelectedEpisode(episodeNum);
    updatePlayerUrl(episodeNum, selectedAudio);
  };

  const handleAudioChange = (audioId: string) => {
    setSelectedAudio(audioId);
    updatePlayerUrl(selectedEpisode, audioId);
  };

  const copyToClipboard = () => {
    if (watchTogetherLink) {
      navigator.clipboard.writeText(watchTogetherLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="kodik-player-container">
      {/* SELECTORS FOR EPISODES AND AUDIO */}
      {(episodes.length > 0 || audios.length > 0) && (
        <div className="player-controls">
          {episodes.length > 0 && (
            <div className="control-group">
              <label htmlFor="episode-select">📺 Серия:</label>
              <select
                id="episode-select"
                value={selectedEpisode}
                onChange={(e) => handleEpisodeChange(parseInt(e.target.value))}
                className="episode-select"
              >
                {episodes.map((ep) => (
                  <option key={ep.number} value={ep.number}>
                    {ep.title || `Серия ${ep.number}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {audios.length > 0 && (
            <div className="control-group">
              <label htmlFor="audio-select">🔊 Озвучка:</label>
              <select
                id="audio-select"
                value={selectedAudio}
                onChange={(e) => handleAudioChange(e.target.value)}
                className="audio-select"
              >
                {audios.map((audio) => (
                  <option key={audio.id} value={audio.id}>
                    {audio.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {currentVideoUrl ? (
        <div className="kodik-player-video">
          <iframe
            src={currentVideoUrl}
            width="607"
            height="360"
            frameBorder="0"
            allowFullScreen
            allow="autoplay *; fullscreen *"
            title="Kodik Player"
          ></iframe>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="player-loading">
              <div className="loading-spinner"></div>
              <p>Загружаю доступные серии и озвучки...</p>
            </div>
          )}
        </>
      )}

      {allowWatchTogether && watchTogetherLink && (
        <div className="watch-together-info">
          <p>
            📤 <strong>Ссылка для совместного просмотра:</strong>
          </p>
          <div className="watch-together-link-box">
            <input
              type="text"
              value={watchTogetherLink}
              readOnly
              className="watch-together-link-input"
            />
            <button className="btn-copy" onClick={copyToClipboard}>
              {copied ? '✓' : '📋'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KodikPlayer;
