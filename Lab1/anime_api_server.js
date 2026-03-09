import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// API endpoint для получения информации об аниме
app.get('/api/anime/info/:shikimoriId', (req, res) => {
  const { shikimoriId } = req.params;

  // Запускаем Python скрипт
  const pythonProcess = spawn('python', [
    path.join(__dirname, 'anime_fetcher.py'),
    'info',
    shikimoriId
  ]);

  let data = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (chunk) => {
    data += chunk.toString();
  });

  pythonProcess.stderr.on('data', (chunk) => {
    errorData += chunk.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(data);
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: 'Ошибка парсинга JSON', details: data });
      }
    } else {
      res.status(500).json({
        error: 'Ошибка выполнения Python скрипта',
        code,
        stderr: errorData
      });
    }
  });

  pythonProcess.on('error', (error) => {
    res.status(500).json({ error: 'Ошибка запуска Python скрипта', details: error.message });
  });
});

// API endpoint для поиска аниме
app.get('/api/anime/search', (req, res) => {
  const { q: query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Параметр q обязателен' });
  }

  // Временное решение - возвращаем тестовые данные
  const mockResults = [
    {
      title: 'Naruto',
      shikimori_id: '20',
      type: 'TV Сериал',
      year: '2002',
      status: 'вышло',
      studio: 'Studio Pierrot',
      link: 'https://shikimori.one/animes/z20-naruto'
    },
    {
      title: 'Naruto: Shippuuden',
      shikimori_id: '1735',
      type: 'TV Сериал',
      year: '2007',
      status: 'вышло',
      studio: 'Studio Pierrot',
      link: 'https://shikimori.one/animes/z1735-naruto-shippuuden'
    },
    {
      title: 'Attack on Titan',
      shikimori_id: '430',
      type: 'TV Сериал',
      year: '2013',
      status: 'вышло',
      studio: 'WIT,MAPPA',
      link: 'https://shikimori.one/animes/z430-shingeki-no-kyojin'
    },
    {
      title: 'One Piece',
      shikimori_id: '5',
      type: 'TV Сериал',
      year: '1999',
      status: 'вышло',
      studio: 'Toei Animation',
      link: 'https://shikimori.one/animes/z5-one-piece'
    }
  ];

  // Фильтруем результаты по запросу
  const filteredResults = mockResults.filter(result =>
    result.title.toLowerCase().includes(query.toLowerCase())
  );

  res.json({
    success: true,
    results: filteredResults
  });
});

// API endpoint для получения списка популярных аниме
app.get('/api/anime/list', (req, res) => {
  const limit = req.query.limit || 10;

  // Запускаем Python скрипт
  const pythonProcess = spawn('python', [
    path.join(__dirname, 'anime_fetcher.py'),
    'list',
    limit.toString()
  ]);

  let data = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (chunk) => {
    data += chunk.toString();
  });

  pythonProcess.stderr.on('data', (chunk) => {
    errorData += chunk.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(data);
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: 'Ошибка парсинга JSON', details: data });
      }
    } else {
      res.status(500).json({
        error: 'Ошибка выполнения Python скрипта',
        code,
        stderr: errorData
      });
    }
  });

  pythonProcess.on('error', (error) => {
    res.status(500).json({ error: 'Ошибка запуска Python скрипта', details: error.message });
  });
});

// API endpoint для получения Kodik ссылок
app.get('/api/anime/kodik/:shikimoriId/:episode?/:translation?', (req, res) => {
  const { shikimoriId, episode, translation } = req.params;

  // Запускаем Python скрипт для получения Kodik ссылок
  const pythonProcess = spawn('python', [
    path.join(__dirname, 'anime_fetcher.py'),
    'kodik',
    shikimoriId,
    episode || '',
    translation || ''
  ]);

  let data = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (chunk) => {
    data += chunk.toString();
  });

  pythonProcess.stderr.on('data', (chunk) => {
    errorData += chunk.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(data);
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: 'Ошибка парсинга JSON', details: data });
      }
    } else {
      res.status(500).json({
        error: 'Ошибка выполнения Python скрипта',
        code,
        stderr: errorData
      });
    }
  });

  pythonProcess.on('error', (error) => {
    res.status(500).json({ error: 'Ошибка запуска Python скрипта', details: error.message });
  });
});

app.listen(PORT, () => {
  console.log(`Anime API сервер запущен на порту ${PORT}`);
});