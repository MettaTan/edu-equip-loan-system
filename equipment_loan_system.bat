cd /D "%~dp0"
:loop
start server.bat | set /P "="
goto loop