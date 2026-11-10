@echo off
rem owf: the Docker installation's command for Windows, the same commands as ./owf. Run: owf.cmd help
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0owf.ps1" %*
