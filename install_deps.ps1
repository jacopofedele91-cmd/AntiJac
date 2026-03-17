$ErrorActionPreference = "Stop"

Write-Host "Starting silent installations for user scope..."

if (!(Test-Path "python-installer.exe")) {
    Write-Host "Downloading Python 3.12..."
    Invoke-WebRequest -Uri "https://www.python.org/ftp/python/3.12.2/python-3.12.2-amd64.exe" -OutFile "python-installer.exe"
}
Write-Host "Installing Python 3.12 silently..."
Start-Process -Wait -FilePath ".\python-installer.exe" -ArgumentList "/quiet", "InstallAllUsers=0", "PrependPath=1", "Include_test=0" -NoNewWindow

if (!(Test-Path "node-installer.msi")) {
    Write-Host "Downloading Node.js 20.11..."
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi" -OutFile "node-installer.msi"
}
Write-Host "Installing Node.js silently..."
Start-Process -Wait -FilePath "msiexec.exe" -ArgumentList "/i", "node-installer.msi", "/qn", "ALLUSERS=2", "MSIINSTALLPERUSER=1" -NoNewWindow

Write-Host "Refreshing PATH environment variables..."
$env:PATH = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

node -v
python -V
Write-Host "Installations complete."
