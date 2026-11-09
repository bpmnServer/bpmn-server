@echo off
rem A shell in the running server container.
cd /d "%~dp0"
docker compose exec server sh
