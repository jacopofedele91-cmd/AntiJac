$ErrorActionPreference = "Stop"
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
$MachinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$env:Path = "$MachinePath;$UserPath"
npm run build
