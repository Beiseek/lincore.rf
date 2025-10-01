# Руководство по развертыванию Django проекта на VPS

## Содержание
1. [Подготовка проекта](#1-подготовка-проекта)
2. [Настройка VPS сервера](#2-настройка-vps-сервера)
3. [Развертывание проекта](#3-развертывание-проекта)
4. [Настройка Gunicorn](#4-настройка-gunicorn)
5. [Настройка Nginx](#5-настройка-nginx)
6. [SSL сертификат (Let's Encrypt)](#6-ssl-сертификат-lets-encrypt)
7. [Мониторинг и логи](#7-мониторинг-и-логи)
8. [Резервное копирование](#8-резервное-копирование)
9. [Безопасность](#9-безопасность)

---

## 1. Подготовка проекта

### 1.1. Создание .env файла для локальной разработки

Переименуйте `env_example.txt` в `.env` и заполните:

```bash
SECRET_KEY=ваш-секретный-ключ
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 1.2. Генерация нового SECRET_KEY для продакшена

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

Сохраните этот ключ - он понадобится на сервере!

### 1.3. Проверка requirements.txt

Убедитесь, что файл `requirements.txt` содержит все необходимые пакеты:
- Django==3.2.25
- Pillow==10.0.0
- gunicorn==21.2.0
- whitenoise==6.5.0
- psycopg2-binary==2.9.7 (если используете PostgreSQL)

---

## 2. Настройка VPS сервера

### 2.1. Выбор провайдера VPS

**Рекомендуемые провайдеры:**
- **Timeweb** (Россия) - от 300₽/месяц
- **Beget** (Россия) - от 200₽/месяц
- **DigitalOcean** - от $6/месяц
- **Hetzner** - от €3.5/месяц

**Минимальные требования:**
- 1 CPU
- 1GB RAM
- 20GB SSD
- Ubuntu 20.04 или 22.04

### 2.2. Подключение к серверу

```bash
ssh root@ваш-ip-адрес
```

### 2.3. Обновление системы и установка пакетов

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install python3 python3-pip python3-venv nginx -y

# Установка PostgreSQL (опционально, но рекомендуется)
sudo apt install postgresql postgresql-contrib -y
```

### 2.4. Создание пользователя для проекта

```bash
sudo adduser django
sudo usermod -aG sudo django
```

### 2.5. Настройка PostgreSQL (опционально)

```bash
sudo -u postgres psql

# В psql:
CREATE DATABASE engineering_site_db;
CREATE USER django_user WITH PASSWORD 'безопасный_пароль';
ALTER ROLE django_user SET client_encoding TO 'utf8';
ALTER ROLE django_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE django_user SET timezone TO 'Europe/Moscow';
GRANT ALL PRIVILEGES ON DATABASE engineering_site_db TO django_user;
\q
```

---

## 3. Развертывание проекта

### 3.1. Подключение под пользователем django

```bash
sudo su - django
```

### 3.2. Создание директорий

```bash
mkdir -p ~/projects
cd ~/projects
```

### 3.3. Загрузка проекта

**Вариант 1: Из архива (рекомендуется)**
```bash
# На вашем компьютере создайте архив проекта
# Загрузите на сервер через scp:
# scp engineering_site.zip django@ваш-ip:~/projects/

unzip engineering_site.zip
cd engineering_site
```

**Вариант 2: Через git**
```bash
git clone ваш-репозиторий engineering_site
cd engineering_site
```

### 3.4. Создание виртуального окружения

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3.5. Установка зависимостей

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3.6. Настройка переменных окружения

```bash
nano .env
```

Содержимое `.env` для продакшена:

```bash
SECRET_KEY=ваш-сгенерированный-секретный-ключ
DEBUG=False
ALLOWED_HOSTS=ваш-домен.ru,www.ваш-домен.ru,ваш-ip-адрес

# Если используете PostgreSQL:
DB_NAME=engineering_site_db
DB_USER=django_user
DB_PASSWORD=безопасный_пароль
DB_HOST=localhost
DB_PORT=5432
```

### 3.7. Применение миграций

```bash
# Для SQLite (по умолчанию)
python manage.py migrate

# Для PostgreSQL раскомментируйте настройки БД в settings_production.py
```

### 3.8. Создание суперпользователя

```bash
python manage.py createsuperuser
```

### 3.9. Сбор статических файлов

```bash
python manage.py collectstatic --noinput
```

### 3.10. Создание директории для логов

```bash
mkdir -p ~/projects/engineering_site/logs
```

---

## 4. Настройка Gunicorn

### 4.1. Создание конфигурационного файла

```bash
nano ~/projects/engineering_site/gunicorn_config.py
```

Содержимое:

```python
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 100
preload_app = True
accesslog = "/home/django/projects/engineering_site/logs/gunicorn_access.log"
errorlog = "/home/django/projects/engineering_site/logs/gunicorn_error.log"
loglevel = "info"
```

### 4.2. Тестирование Gunicorn

```bash
cd ~/projects/engineering_site
source venv/bin/activate
gunicorn --config gunicorn_config.py engineering_site.wsgi:application
```

Если работает, нажмите `Ctrl+C` для остановки.

### 4.3. Создание systemd сервиса

Выйдите из пользователя django:
```bash
exit
```

Создайте сервис:
```bash
sudo nano /etc/systemd/system/engineering_site.service
```

Содержимое:

```ini
[Unit]
Description=Engineering Site Gunicorn Daemon
After=network.target

[Service]
User=django
Group=www-data
WorkingDirectory=/home/django/projects/engineering_site
Environment="DJANGO_SETTINGS_MODULE=engineering_site.settings_production"
ExecStart=/home/django/projects/engineering_site/venv/bin/gunicorn \
    --config /home/django/projects/engineering_site/gunicorn_config.py \
    engineering_site.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 4.4. Запуск и проверка сервиса

```bash
sudo systemctl daemon-reload
sudo systemctl enable engineering_site
sudo systemctl start engineering_site
sudo systemctl status engineering_site
```

---

## 5. Настройка Nginx

### 5.1. Создание конфигурации Nginx

```bash
sudo nano /etc/nginx/sites-available/engineering_site
```

Содержимое:

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;
    
    client_max_body_size 10M;

    location = /favicon.ico { 
        access_log off; 
        log_not_found off; 
    }
    
    location /static/ {
        alias /home/django/projects/engineering_site/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    location /media/ {
        alias /home/django/projects/engineering_site/media/;
        expires 30d;
        add_header Cache-Control "public";
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

### 5.2. Активация конфигурации

```bash
sudo ln -s /etc/nginx/sites-available/engineering_site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5.3. Настройка прав доступа

```bash
sudo chmod -R 755 /home/django/projects/engineering_site/staticfiles
sudo chmod -R 755 /home/django/projects/engineering_site/media
sudo chown -R django:www-data /home/django/projects/engineering_site/media
```

---

## 6. SSL сертификат (Let's Encrypt)

### 6.1. Установка Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2. Получение сертификата

```bash
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

Следуйте инструкциям на экране:
- Введите email
- Согласитесь с условиями
- Выберите опцию перенаправления HTTP на HTTPS (рекомендуется)

### 6.3. Автоматическое обновление сертификата

Certbot автоматически настраивает обновление. Проверьте:

```bash
sudo systemctl status certbot.timer
```

### 6.4. Тестирование обновления

```bash
sudo certbot renew --dry-run
```

---

## 7. Мониторинг и логи

### 7.1. Просмотр логов Django

```bash
# Логи Gunicorn
sudo tail -f /home/django/projects/engineering_site/logs/gunicorn_access.log
sudo tail -f /home/django/projects/engineering_site/logs/gunicorn_error.log

# Логи Django
sudo tail -f /home/django/projects/engineering_site/logs/django_errors.log

# Логи systemd
sudo journalctl -u engineering_site -f
```

### 7.2. Логи Nginx

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 7.3. Мониторинг ресурсов

```bash
# Установка инструментов
sudo apt install htop ncdu -y

# Мониторинг процессов
htop

# Проверка использования диска
df -h
ncdu /home/django
```

---

## 8. Резервное копирование

### 8.1. Создание скрипта бэкапа

```bash
sudo nano /home/django/backup.sh
```

Содержимое для SQLite:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/django/backups"
PROJECT_DIR="/home/django/projects/engineering_site"

mkdir -p $BACKUP_DIR

# Бэкап базы данных SQLite
cp $PROJECT_DIR/db.sqlite3 $BACKUP_DIR/db_$DATE.sqlite3

# Бэкап медиа файлов
tar -czf $BACKUP_DIR/media_$DATE.tar.gz -C $PROJECT_DIR media/

# Удаление старых бэкапов (старше 7 дней)
find $BACKUP_DIR -name "db_*.sqlite3" -mtime +7 -delete
find $BACKUP_DIR -name "media_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Для PostgreSQL:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/django/backups"
PROJECT_DIR="/home/django/projects/engineering_site"

mkdir -p $BACKUP_DIR

# Бэкап базы данных PostgreSQL
pg_dump engineering_site_db > $BACKUP_DIR/db_$DATE.sql

# Бэкап медиа файлов
tar -czf $BACKUP_DIR/media_$DATE.tar.gz -C $PROJECT_DIR media/

# Удаление старых бэкапов (старше 7 дней)
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "media_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### 8.2. Настройка прав и автоматизации

```bash
sudo chmod +x /home/django/backup.sh
sudo chown django:django /home/django/backup.sh

# Настройка cron для автоматических бэкапов (каждый день в 2 ночи)
sudo crontab -u django -e
```

Добавьте:
```
0 2 * * * /home/django/backup.sh >> /home/django/backup.log 2>&1
```

---

## 9. Безопасность

### 9.1. Настройка файрвола (UFW)

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 9.2. Отключение root-доступа по SSH

```bash
sudo nano /etc/ssh/sshd_config
```

Найдите и измените:
```
PermitRootLogin no
PasswordAuthentication no  # Если используете SSH-ключи
```

Перезапустите SSH:
```bash
sudo systemctl restart sshd
```

### 9.3. Автоматические обновления безопасности

```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 9.4. Fail2Ban (защита от брутфорса)

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 10. Обновление проекта

### 10.1. Обновление кода

```bash
cd /home/django/projects/engineering_site
source venv/bin/activate

# Если используете git:
git pull

# Обновление зависимостей
pip install -r requirements.txt

# Применение миграций
python manage.py migrate

# Сбор статических файлов
python manage.py collectstatic --noinput

# Перезапуск сервиса
sudo systemctl restart engineering_site
```

### 10.2. Обновление фотографий через админку

1. Перейдите на `https://ваш-домен.ru/admin/`
2. Войдите под суперпользователем
3. Выберите нужную категорию фотографий
4. Замените существующие или добавьте новые фотографии
5. Изменения применятся автоматически

---

## 11. Полезные команды

### Управление сервисами
```bash
# Перезапуск всех сервисов
sudo systemctl restart engineering_site nginx

# Проверка статуса
sudo systemctl status engineering_site nginx

# Остановка/запуск
sudo systemctl stop engineering_site
sudo systemctl start engineering_site
```

### Проверка работоспособности
```bash
# Проверка работы Gunicorn
curl http://127.0.0.1:8000

# Проверка работы Nginx
curl http://localhost

# Проверка SSL
curl https://ваш-домен.ru
```

---

## 12. Решение проблем

### Проблема: 502 Bad Gateway

**Проверьте:**
```bash
sudo systemctl status engineering_site
sudo tail -f /home/django/projects/engineering_site/logs/gunicorn_error.log
```

**Решение:**
- Убедитесь, что Gunicorn запущен
- Проверьте права доступа к файлам
- Проверьте, что сокет доступен

### Проблема: Статические файлы не загружаются

**Проверьте:**
```bash
ls -la /home/django/projects/engineering_site/staticfiles/
sudo nginx -t
```

**Решение:**
```bash
python manage.py collectstatic --noinput
sudo chmod -R 755 /home/django/projects/engineering_site/staticfiles
sudo systemctl restart nginx
```

### Проблема: Медиа файлы не загружаются

**Решение:**
```bash
sudo chown -R django:www-data /home/django/projects/engineering_site/media
sudo chmod -R 755 /home/django/projects/engineering_site/media
```

---

## 13. Примерная стоимость

- **VPS**: 300-1000₽/месяц (зависит от провайдера)
- **Домен**: 200-500₽/год (.ru/.com)
- **SSL**: Бесплатно (Let's Encrypt)
- **Итого**: ~400-1200₽/месяц

---

## 14. Контрольный чеклист

- [ ] VPS сервер настроен и обновлен
- [ ] PostgreSQL установлен и настроен (опционально)
- [ ] Проект загружен на сервер
- [ ] Виртуальное окружение создано
- [ ] Зависимости установлены
- [ ] .env файл настроен
- [ ] Миграции применены
- [ ] Суперпользователь создан
- [ ] Статические файлы собраны
- [ ] Gunicorn настроен и запущен
- [ ] Nginx настроен и запущен
- [ ] SSL сертификат установлен
- [ ] Файрвол настроен
- [ ] Бэкапы настроены
- [ ] Логи проверяются корректно
- [ ] Сайт доступен по HTTPS

---

## Поддержка

При возникновении проблем проверьте:
1. Логи Gunicorn
2. Логи Nginx
3. Логи systemd
4. Права доступа к файлам
5. Переменные окружения в .env

**Успешного деплоя! 🚀**
