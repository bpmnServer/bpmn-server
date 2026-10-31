@echo off
rem First time: .env with random keys for docker-compose.yml
if not exist .env powershell -NoProfile -Command "$k = { -join ((1..32) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) }) }; \"API_KEY=$(& $k)`nADMIN_API_KEY=$(& $k)`nSESSION_SECRET=$(& $k)\" | Set-Content -Encoding ascii .env; 'created .env'"
docker compose up -d
