@echo off
rem Build ralphhanna/bpmn-server from the latest npm release or a specific version.
cd /d "%~dp0"
if not "%~1"=="" (
    docker build --build-arg BPMN_VERSION=%~1 -t ralphhanna/bpmn-server:%~1 .
    exit /b %errorlevel%
)
for /f %%v in ('npm view bpmn-server version') do set VERSION=%%v
if "%VERSION%"=="" exit /b 1
docker build --build-arg BPMN_VERSION=%VERSION% -t ralphhanna/bpmn-server:%VERSION% -t ralphhanna/bpmn-server:latest .
