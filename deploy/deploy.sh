#!/bin/bash
# Скрипт деплоя на сервере — вызывается из GitHub Actions
# Путь на сервере: /var/www/ficussword/deploy.sh

set -e  # остановить при любой ошибке

REPO_DIR="/var/www/ficussword"
FRONTEND_OUT="/var/www/ficussword/frontend"
BACKEND_OUT="/var/www/ficussword/backend"
NODE_OUT="/var/www/ficussword/node"

echo "==> Pulling latest code..."
cd $REPO_DIR
git pull origin main

# ── ФРОНТ ──────────────────────────────────────────────
echo "==> Building frontend..."
cd $REPO_DIR/Lab1
npm ci
npm run build
rm -rf $FRONTEND_OUT
cp -r dist $FRONTEND_OUT

# ── C# БЭКЕНД ──────────────────────────────────────────
echo "==> Publishing C# backend..."
cd "$REPO_DIR/бек для авторизации/WebApplication21"
dotnet publish -c Release -o $BACKEND_OUT
echo "==> Restarting backend service..."
sudo systemctl restart anime-backend

# ── NODE.JS ────────────────────────────────────────────
echo "==> Updating Node.js server..."
cp $REPO_DIR/Lab1/anime_api_server.js $NODE_OUT/
cd $NODE_OUT
npm ci --omit=dev
pm2 restart anime-node || pm2 start /var/www/ficussword/deploy/ecosystem.config.cjs

# ── NGINX ──────────────────────────────────────────────
echo "==> Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "==> Deploy done!"
