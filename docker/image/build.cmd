@echo off
rem Build bpmnserver/bpmn-server from an npm release: build.cmd [version] (default: the latest on npm).
rem The four packages must be on npm at that version. Tagged <version>, and latest when it is npm's latest.
setlocal
cd /d "%~dp0"
for /f %%v in ('npm view bpmn-server version --prefer-online') do set LATEST=%%v
if "%LATEST%"=="" (echo Could not read bpmn-server's latest version from npm & exit /b 1)
set VERSION=%~1
if "%VERSION%"=="" set VERSION=%LATEST%

for %%p in (bpmn-server bpmn-web bpmn-client bpmn-mcp) do (
    call :published %%p || exit /b 1
)

set TAGS=-t bpmnserver/bpmn-server:%VERSION%
if "%VERSION%"=="%LATEST%" set TAGS=%TAGS% -t bpmnserver/bpmn-server:latest
echo Building bpmnserver/bpmn-server:%VERSION%
docker build --build-arg BPMN_VERSION=%VERSION% %TAGS% . || exit /b 1

set BUILT=
for /f %%v in ('docker run --rm --entrypoint node bpmnserver/bpmn-server:%VERSION% -p "require('./node_modules/bpmn-server/package.json').version"') do set BUILT=%%v
if not "%BUILT%"=="%VERSION%" (echo The image holds bpmn-server %BUILT%, not %VERSION% & exit /b 1)
echo Built bpmnserver/bpmn-server:%VERSION%
if "%VERSION%"=="%LATEST%" (echo   and tagged latest) else (echo   not tagged latest: npm's latest is %LATEST%)
echo Next: node test.mjs bpmnserver/bpmn-server:%VERSION%, then push.cmd
exit /b 0

:published
set FOUND=
for /f %%v in ('npm view %1@%VERSION% version --prefer-online 2^>nul') do set FOUND=%%v
if "%FOUND%"=="%VERSION%" exit /b 0
echo %1@%VERSION% is not on npm: publish it first
exit /b 1
