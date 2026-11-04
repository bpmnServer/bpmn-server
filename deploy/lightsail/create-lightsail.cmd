@echo off
rem A bpmn-server on AWS Lightsail: double-click, or run with options (create-lightsail.cmd --help).
rem Runs create-lightsail.sh with Git for Windows' bash; needs the AWS CLI, signed in (aws configure).
setlocal
set "BASH=%ProgramFiles%\Git\bin\bash.exe"
if not exist "%BASH%" (
    echo Git for Windows is needed for its bash: https://git-scm.com/download/win
    pause
    exit /b 1
)
"%BASH%" "%~dp0create-lightsail.sh" %*
echo.
pause
