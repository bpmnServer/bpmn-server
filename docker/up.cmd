@echo off
rem Create the .env file next to this script once; do not overwrite user configuration.
cd /d "%~dp0"
if not exist .env powershell -NoProfile -Command "$k = { [guid]::NewGuid().ToString('N') }; $p = $k.Invoke(); ('PORT=3000'), ('MONGO_DB_URL=memory'), ('REQUIRE_AUTHENTICATION=true'), ('ENFORCE_SECURITY=true'), ('API_SERVICE_USER_NAME=integration'), ('API_SERVICE_USER_GROUPS=SYSTEM'), ('API_KEY=' + $k.Invoke()), ('ADMIN_API_KEY=' + $k.Invoke()), ('SESSION_SECRET=' + $k.Invoke()), ('ADMIN_PASSWORD=' + $p) | Set-Content -Encoding ascii .env; 'created local .env; initial admin password: ' + $p"
docker compose up -d --remove-orphans
