@echo off
rem First time: .env with random keys and the password of admin, for docker-compose.yml
if not exist .env powershell -NoProfile -Command "$k = { [guid]::NewGuid().ToString('N') }; $p = $k.Invoke(); ('API_KEY=' + $k.Invoke()), ('ADMIN_API_KEY=' + $k.Invoke()), ('SESSION_SECRET=' + $k.Invoke()), ('ADMIN_PASSWORD=' + $p) | Set-Content -Encoding ascii .env; 'created .env; sign in as admin, password ' + $p"
docker compose up -d
