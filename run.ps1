# Tesseract Startup Script for PowerShell
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host " Starting Tesseract System (Backend + Frontend)" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\.venv\Scripts\python.exe -m uvicorn backend.api.main:app --host 127.0.0.1 --port 8000"

Write-Host "[2/2] Starting React + Vite Frontend on http://127.0.0.1:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev -- --host 127.0.0.1 --port 5173"

Write-Host "`n===================================================" -ForegroundColor Cyan
Write-Host "Applications are launching:" -ForegroundColor Green
Write-Host "  - Frontend:          http://127.0.0.1:5173/" -ForegroundColor White
Write-Host "  - Backend API Docs:  http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "  - Examiner Console:  http://127.0.0.1:8000/console/" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Cyan
