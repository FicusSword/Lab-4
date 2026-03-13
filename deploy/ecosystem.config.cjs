// pm2 конфиг для Node.js сервера (Kodik proxy)
// Запуск: pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: 'anime-node',
      script: '/var/www/ficussword/node/anime_api_server.js',
      interpreter: 'node',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
