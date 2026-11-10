@echo off
rem Push bpmnserver/bpmn-server: push.cmd [version] (default: the latest on npm, as build.cmd builds).
rem The image must hold that version; latest goes with it only when it is the same image.
setlocal
cd /d "%~dp0"
set IMAGE=bpmnserver/bpmn-server
set VERSION=%~1
if "%VERSION%"=="" for /f %%v in ('npm view bpmn-server version --prefer-online') do set VERSION=%%v
if "%VERSION%"=="" (echo Could not read bpmn-server's latest version from npm & exit /b 1)

set ID=
for /f %%i in ('docker image inspect --format "{{.Id}}" %IMAGE%:%VERSION% 2^>nul') do set ID=%%i
if "%ID%"=="" (echo No local image %IMAGE%:%VERSION%: run build.cmd %VERSION% first & exit /b 1)
set HELD=
for /f %%v in ('docker run --rm --entrypoint node %IMAGE%:%VERSION% -p "require('./node_modules/bpmn-server/package.json').version"') do set HELD=%%v
if not "%HELD%"=="%VERSION%" (echo %IMAGE%:%VERSION% holds bpmn-server %HELD%: not pushed & exit /b 1)

echo Pushing %IMAGE%:%VERSION%
docker push %IMAGE%:%VERSION% || exit /b 1
set LATESTID=
for /f %%i in ('docker image inspect --format "{{.Id}}" %IMAGE%:latest 2^>nul') do set LATESTID=%%i
if "%LATESTID%"=="%ID%" (
    docker push %IMAGE%:latest || exit /b 1
) else (
    echo latest not pushed: it is not %IMAGE%:%VERSION%
)
