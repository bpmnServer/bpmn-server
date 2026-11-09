@echo off
rem Docker management command for Windows: the same commands as ./bpmn. Run: bpmn.cmd help
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0bpmn.ps1" %*
