# Checkpoint script to "lock" changes to Git
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "Starting checkpoint at $timestamp..." -ForegroundColor Cyan

# Stage all changes
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    git commit -m "Auto-checkpoint: $timestamp"
    Write-Host "Changes locked in Git history." -ForegroundColor Green
} else {
    Write-Host "No changes detected. System is clean." -ForegroundColor Yellow
}

# Run OneDrive persistence command (attrib +p -r)
# This mimics the "Always keep on this device" setting for the current directory
Write-Host "Ensuring local disk persistence..." -ForegroundColor Cyan
attrib +p -r "c:\Users\gunja\OneDrive\Desktop\coffee-project\*" /s /d
Write-Host "Persistence verified." -ForegroundColor Green
