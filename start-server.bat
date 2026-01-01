@echo off
echo ========================================
echo Normal Map Online - Local Server
echo ========================================
echo.
echo Starting local web server...
echo Open your browser and visit: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python -m http.server 8000
