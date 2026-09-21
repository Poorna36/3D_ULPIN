@echo off
echo ===================================================
echo Starting 3D ULPIN System (Backend + Frontend)
echo ===================================================

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "3D ULPIN Backend (FastAPI)" cmd /k ".venv\Scripts\python.exe -m uvicorn backend.api.main:app --host 127.0.0.1 --port 8000"

echo [2/2] Starting React + Vite Frontend on http://127.0.0.1:5173 ...
cd frontend
start "3D ULPIN Frontend (Vite)" cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"
cd ..

echo.
echo ===================================================
echo Applications are running:
echo   - Frontend:          http://127.0.0.1:5173/
echo   - Backend API Docs:  http://127.0.0.1:8000/docs
echo   - Examiner Console:  http://127.0.0.1:8000/console/
echo ===================================================
