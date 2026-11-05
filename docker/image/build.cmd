@echo off
rem The image of a bpmn-web release from npm. No version: the latest, tagged with its version and latest.
rem   build.cmd [version]
cd /d "%~dp0"
if not "%~1"=="" (
    docker build --build-arg BPMN_VERSION=%~1 -t ralphhanna/bpmn-web:%~1 .
    exit /b %errorlevel%
)
for /f %%v in ('npm view bpmn-web version') do set VERSION=%%v
docker build --build-arg BPMN_VERSION=%VERSION% -t ralphhanna/bpmn-web:%VERSION% -t ralphhanna/bpmn-web:latest .
