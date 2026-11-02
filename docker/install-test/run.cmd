@echo off
rem The install test: installs bpmn-server, bpmn-web and bpmn-client in a clean container and checks they work.
rem   run.cmd                   the packages of this repository (npm pack), before publishing them
rem   run.cmd npm [version]     the published packages (default latest)
rem   set TEMPLATE=minimal      before run.cmd: with npx bpmn-server init --minimal
setlocal
cd /d "%~dp0"
set SOURCE=%1
if "%SOURCE%"=="" set SOURCE=local
set VERSION=%2
if "%VERSION%"=="" set VERSION=latest

if exist packages rmdir /s /q packages
mkdir packages
if "%SOURCE%"=="local" (
    pushd ..\..
    call npm pack -w bpmn-server -w bpmn-web -w bpmn-client --pack-destination docker/install-test/packages || exit /b 1
    popd
)

docker compose up --build --abort-on-container-exit --exit-code-from tester
set STATUS=%ERRORLEVEL%
docker compose down -v
exit /b %STATUS%
