# =============================================
# Hollandse Helden - Kiosk Opstartscript
# =============================================

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

function Show-Popup($message) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show($message, "Kiosk Opstart", "OK", "Error")
}

# --- 1. Wacht op Docker Desktop ---
Write-Host "[1/4] Wachten op Docker Desktop..."
$maxWait = 180
$elapsed = 0
$dockerReady = $false

do {
    Start-Sleep -Seconds 5
    $elapsed += 5
    docker info 2>&1 | Out-Null
    $dockerReady = ($LASTEXITCODE -eq 0)
    Write-Host "  Docker check... ($elapsed s)"
} while (-not $dockerReady -and $elapsed -lt $maxWait)

if (-not $dockerReady) {
    Show-Popup "Docker is niet opgestart binnen $maxWait seconden. Start Docker Desktop en probeer opnieuw."
    exit 1
}

Write-Host "[1/4] Docker is klaar!"

# --- 2. Start de server ---
Write-Host "[2/4] Server starten (poort 3000)..."
Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/k title Hollandse Helden - Server && cd /d `"$projectRoot\server`" && node server.js"

Start-Sleep -Seconds 3

# --- 3. Start de web dev server ---
Write-Host "[3/4] Web server starten (poort 5173)..."
Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/k title Hollandse Helden - Web && cd /d `"$projectRoot\web`" && npm run dev"

# --- Wacht tot poort 5173 bereikbaar is ---
Write-Host "[3/4] Wachten op web server (poort 5173)..."
$webReady = $false
$elapsed = 0

do {
    Start-Sleep -Seconds 2
    $elapsed += 2
    $result = Test-NetConnection -ComputerName localhost -Port 5173 -WarningAction SilentlyContinue -InformationLevel Quiet
    $webReady = $result
    Write-Host "  Web check... ($elapsed s)"
} while (-not $webReady -and $elapsed -lt 90)

if (-not $webReady) {
    Show-Popup "Web server is niet opgestart binnen 90 seconden."
    exit 1
}

Write-Host "[3/4] Web server is klaar!"

# --- 4. Open Chrome in Kiosk modus ---
Write-Host "[4/4] Chrome openen in kiosk modus..."

$chromePaths = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chrome = $chromePaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($chrome) {
    Start-Process -FilePath $chrome `
        -ArgumentList "--kiosk --no-first-run --disable-infobars --disable-session-crashed-bubble http://localhost:5173"
    Write-Host "[4/4] Kiosk gestart!"
} else {
    Show-Popup "Google Chrome niet gevonden. Installeer Chrome of pas het pad aan in start-kiosk.ps1"
    exit 1
}
