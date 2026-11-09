@echo off
rem Build bpmnserver/bpmn-server from the latest npm release or a specific version.
cd /d "%~dp0"
if not "%~1"=="" (
    docker build --build-arg BPMN_VERSION=%~1 -t bpmnserver/bpmn-server:%~1 .
    exit /b %errorlevel%
)
for /f %%v in ('npm view bpmn-server version') do set VERSION=%%v
if "%VERSION%"=="" exit /b 1
docker build --build-arg BPMN_VERSION=%VERSION% -t bpmnserver/bpmn-server:%VERSION% -t bpmnserver/bpmn-server:latest .
