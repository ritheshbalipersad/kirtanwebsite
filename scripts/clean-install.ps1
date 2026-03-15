# Fix "lockfileTryAcquireSync is not a function" - clean reinstall
# Run from project root: .\scripts\clean-install.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Removing .next and node_modules..."
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }

Write-Host "Running npm install..."
npm install

Write-Host "Done. Run: npm run dev"
