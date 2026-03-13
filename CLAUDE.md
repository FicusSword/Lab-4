# Проект: ficussword.top — Аниме стриминговый сайт

## Стек
- **Фронт**: React + TypeScript + Vite (`Lab1/`)
- **Бэк C#**: ASP.NET Core 8, Entity Framework, SQL Server → нужно перевести на PostgreSQL (`бек для авторизации/WebApplication21/`)
- **Бэк Node.js**: Express сервер для Kodik API proxy (`Lab1/anime_api_server.js`, порт 3001)
- **БД**: SQL Server LocalDB (Windows) → на сервере нужен PostgreSQL
- **Домен**: ficussword.top (SSL уже есть через Xray)

## Архитектура на сервере
```
443 → Xray VLESS (VPN) → fallback → nginx :8080
80  → nginx (редирект на 443)
nginx :8080:
  /          → /var/www/ficussword/frontend (статика React)
  /api/      → C# бэк :5097
  /api/anime → Node.js :3001
  /xui/      → 3x-ui панель :54321
```

## Что уже сделано
- Весь фронт: MainPage, Catalog, WatchPage, AdminPanel, KodikPlayer
- C# бэк: авторизация JWT, CRUD для Products, Schedule, Reviews
- Расписание: связано с AdminPanel и отображается на главной странице
- Kodik API: маршрут готов, нужен токен (вставить в `KODIK_TOKEN` в anime_api_server.js)
- Деплой конфиги: `deploy/` папка

## Что нужно сделать для деплоя

### 1. PostgreSQL (вместо SQL Server)
C# бэк использует SQL Server — на Linux нужно переключить на PostgreSQL:
- Установить PostgreSQL: `apt install postgresql -y`
- Заменить пакет в csproj: `Microsoft.EntityFrameworkCore.SqlServer` → `Npgsql.EntityFrameworkCore.PostgreSQL`
- Поменять connection string в `Program.cs` и `appsettings.json`
- Пересоздать миграции

### 2. Nginx
- Конфиг уже готов: `deploy/nginx.conf`
- Скопировать в `/etc/nginx/sites-available/ficussword.top`
- Симлинк в sites-enabled, убрать default

### 3. Xray fallback
- В 3x-ui добавить fallback destination: `127.0.0.1:8080`
- Порт панели 3x-ui сменить с 80 на 54321

### 4. C# сервис
- Systemd конфиг: `deploy/anime-backend.service` → `/etc/systemd/system/`
- `systemctl enable anime-backend && systemctl start anime-backend`

### 5. Node.js
- Установить pm2: `npm install -g pm2`
- Конфиг: `deploy/ecosystem.config.cjs`
- `pm2 start deploy/ecosystem.config.cjs && pm2 save`

### 6. GitHub Actions
- Workflow: `.github/workflows/deploy.yml`
- Secrets в репо: `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`

## Структура файлов
```
Lab-4/
├── Lab1/                          # Фронт (React)
│   ├── src/
│   │   ├── AdminPanel/            # Панель админа (Products + Schedule)
│   │   ├── MainPage/              # Главная (расписание из /api/schedule)
│   │   ├── KodikPlayer/           # Плеер (ждёт токен Kodik)
│   │   ├── CatalogOBJ/            # Каталог аниме
│   │   └── AuthOBJ/               # Авторизация
│   ├── anime_api_server.js        # Node.js прокси для Kodik
│   └── vite.config.ts             # Прокси: /api → :5097, /api/anime → :3001
│
├── бек для авторизации/
│   └── WebApplication21/
│       ├── Program.cs             # Все API эндпоинты
│       ├── ApplicationContext.cs  # EF DbContext
│       ├── Schedule.cs            # Модель расписания
│       ├── Product.cs             # Модель продукта
│       └── appsettings.json       # Строка подключения + JWT секрет + Admin логин
│
└── deploy/
    ├── nginx.conf                 # Nginx конфиг
    ├── anime-backend.service      # Systemd для C#
    ├── ecosystem.config.cjs       # PM2 для Node.js
    ├── deploy.sh                  # Скрипт деплоя (вызывается из GitHub Actions)
    └── server-setup.sh            # Первоначальная настройка (один раз)

## Важные детали
- Админ логин: admin / admin123 (в appsettings.json → Admin:Username/Password)
- JWT секрет: в appsettings.json → Jwt:SecretKey
- Kodik токен: вставить в `Lab1/anime_api_server.js` → переменная `KODIK_TOKEN`
- Расписание в БД: заполнено (11 записей с аниме Fate)
- SQL Server connection: `Server=(localdb)\mssqllocaldb;Database=applicationdb` → нужно заменить на PostgreSQL
```
