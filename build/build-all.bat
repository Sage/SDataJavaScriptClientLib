@echo off
call sdata-client.bat
if %errorlevel% neq 0 exit /b %errorlevel% 
call mobile-dependencies.bat
if %errorlevel% neq 0 exit /b %errorlevel% 
call mobile-platform.bat
if %errorlevel% neq 0 exit /b %errorlevel% 
call mobile-slx.bat
if %errorlevel% neq 0 exit /b %errorlevel% 
