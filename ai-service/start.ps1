Write-Host "StockSense AI Service - Setup & Launch" -ForegroundColor Cyan
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}
.venv\Scripts\Activate.ps1
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt -q
Write-Host "Starting AI Service on port 8000..." -ForegroundColor Green
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
