$ErrorActionPreference = "Stop"
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
$MachinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$env:Path = "$MachinePath;$UserPath"
Write-Host "Path updated."
npm install
Write-Host "npm install completed."
