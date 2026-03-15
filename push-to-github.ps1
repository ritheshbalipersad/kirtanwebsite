# Push this project to GitHub (run in PowerShell from project folder)
# Repo: https://github.com/ritheshbalipersad/kirtanwebsite.git

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Remove stale lock if any
$lock = ".git\index.lock"
if (Test-Path $lock) { Remove-Item $lock -Force }

Write-Host "Staging files..."
git add .
Write-Host "Committing..."
git commit -m "Initial commit: SkillSwap Pro website"
Write-Host "Adding remote origin..."
git remote add origin https://github.com/ritheshbalipersad/kirtanwebsite.git 2>$null
if ($LASTEXITCODE -ne 0) { git remote set-url origin https://github.com/ritheshbalipersad/kirtanwebsite.git }
Write-Host "Pushing to main..."
git branch -M main
git push -u origin main
Write-Host "Done. View at: https://github.com/ritheshbalipersad/kirtanwebsite"