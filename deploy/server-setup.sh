#!/bin/bash
# Первоначальная настройка сервера (запускается один раз вручную)
# sudo bash server-setup.sh

set -e

DOMAIN="ficussword.top"
REPO_URL="https://github.com/ВАШ_ЮЗЕР/ВАШ_РЕПО.git"  # <-- заменить

echo "==> Installing dependencies..."
apt update && apt upgrade -y
apt install -y nginx git curl unzip

# ── .NET 8 ─────────────────────────────────────────────
echo "==> Installing .NET 8..."
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
apt update
apt install -y dotnet-sdk-8.0

# ── Node.js 20 ─────────────────────────────────────────
echo "==> Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

# ── Папки проекта ──────────────────────────────────────
echo "==> Creating project directories..."
mkdir -p /var/www/ficussword/{repo,frontend,backend,node,deploy}

# ── Клонируем репо ─────────────────────────────────────
echo "==> Cloning repository..."
git clone $REPO_URL /var/www/ficussword/repo

# ── nginx конфиг ───────────────────────────────────────
echo "==> Setting up nginx..."
cp /var/www/ficussword/repo/deploy/nginx.conf /etc/nginx/sites-available/$DOMAIN
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ── systemd сервис для C# ──────────────────────────────
echo "==> Setting up systemd service..."
cp /var/www/ficussword/repo/deploy/anime-backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable anime-backend

# ── pm2 автозапуск ─────────────────────────────────────
pm2 startup systemd -u www-data --hp /home/www-data
cp /var/www/ficussword/repo/deploy/ecosystem.config.cjs /var/www/ficussword/deploy/

# ── Права ──────────────────────────────────────────────
chown -R www-data:www-data /var/www/ficussword

echo ""
echo "==> Server setup done!"
echo ""
echo "Следующие шаги:"
echo "1. В 3x-ui: смени порт панели с 80 на 54321"
echo "2. В 3x-ui: добавь fallback на 127.0.0.1:8080 в настройках VLESS"
echo "3. Запусти: bash /var/www/ficussword/repo/deploy/deploy.sh"
echo "4. В GitHub репо добавь Secrets:"
echo "   SERVER_HOST = IP сервера"
echo "   SERVER_USER = root (или твой юзер)"
echo "   SERVER_SSH_KEY = приватный SSH ключ"
