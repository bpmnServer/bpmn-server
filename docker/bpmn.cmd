@echo off
rem bpmn.cmd: the name of owf.cmd before 3.7, kept until 4.0. It runs owf.cmd, downloading it the first time.
if not exist "%~dp0owf.ps1" (
  echo bpmn is now owf: downloading owf.cmd and owf.ps1 ^(use owf.cmd from now on^)
  curl.exe -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/owf.cmd -o "%~dp0owf.cmd" || exit /b 1
  curl.exe -fsSL https://raw.githubusercontent.com/bpmnServer/bpmn-server/main/docker/owf.ps1 -o "%~dp0owf.ps1" || exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0owf.ps1" %*
