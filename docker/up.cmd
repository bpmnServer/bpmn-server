@echo off
rem Create the .env file next to this script once; do not overwrite user configuration. MongoDB keeps the data: a
rem container of its own, from docker-compose.mongo.yml; MONGO_DB_URL=memory (nothing kept) needs no container.
cd /d "%~dp0"
if not exist .env powershell -NoProfile -Command "$k = { [guid]::NewGuid().ToString('N') }; $p = $k.Invoke(); ('PORT=3000'), ('MONGO_DB_URL=mongodb://mongo:27017/bpmn'), ('REQUIRE_AUTHENTICATION=true'), ('ENFORCE_SECURITY=true'), ('API_SERVICE_USER_NAME=integration'), ('API_SERVICE_USER_GROUPS=SYSTEM'), ('API_KEY=' + $k.Invoke()), ('ADMIN_API_KEY=' + $k.Invoke()), ('SESSION_SECRET=' + $k.Invoke()), ('SECRETS_KEY=' + $k.Invoke()), ('ADMIN_PASSWORD=' + $p) | Set-Content -Encoding ascii .env; 'created local .env; initial admin password: ' + $p"
findstr /b /c:"MONGO_DB_URL=memory" .env >nul
if %errorlevel%==0 (
  docker compose up -d --remove-orphans
) else (
  if not exist docker-compose.mongo.yml curl.exe -fLO https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/docker-compose.mongo.yml
  docker compose -f docker-compose.yml -f docker-compose.mongo.yml up -d --remove-orphans
)
