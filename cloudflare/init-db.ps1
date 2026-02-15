#!/usr/bin/env pwsh
# Initialize D1 Local Database with Migrations
# This script runs all migrations to set up the local database

Write-Host "Initializing D1 Local Database..." -ForegroundColor Cyan

$migrationsPath = Join-Path $PSScriptRoot "migrations"

# Check if migrations directory exists
if (-not (Test-Path $migrationsPath)) {
    Write-Host "ERROR: Migrations directory not found at $migrationsPath" -ForegroundColor Red
    exit 1
}

$migrations = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

if ($migrations.Count -eq 0) {
    Write-Host "ERROR: No migrations found in $migrationsPath" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($migrations.Count) migration(s)" -ForegroundColor Green

# Run init endpoint to execute all migrations
Write-Host "Running migrations via API..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8787/api/init-db" -Method POST -ContentType "application/json" -ErrorAction Stop
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "Database initialized successfully!" -ForegroundColor Green
        Write-Host "$($result.message)" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Database initialization failed: $($result.error)" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "ERROR: Could not initialize database: $_" -ForegroundColor Red
    Write-Host "Make sure wrangler dev is running on http://127.0.0.1:8787" -ForegroundColor Yellow
    exit 1
}

Write-Host "You can now use the API!" -ForegroundColor Cyan
