# dummy_tables.ps1
$cafes = Invoke-RestMethod -Uri "http://localhost:8080/api/cafes/all" -Method Get

if ($cafes.Count -eq 0) {
    Write-Host "No cafes found. Please register a cafe first."
    exit
}

$firstCafe = $cafes[0]
$cafeId = $firstCafe.id
Write-Host "Adding dummy tables to cafe: $($firstCafe.cafeName) (ID: $cafeId)"

$tables = @(
    @{ tableNumber = "T-01"; capacity = 2; price = 0.0; status = "Available"; cafe = @{ id = $cafeId } },
    @{ tableNumber = "T-02"; capacity = 4; price = 0.0; status = "Available"; cafe = @{ id = $cafeId } },
    @{ tableNumber = "T-03"; capacity = 4; price = 0.0; status = "Occupied"; cafe = @{ id = $cafeId } },
    @{ tableNumber = "T-04"; capacity = 6; price = 0.0; status = "Available"; cafe = @{ id = $cafeId } },
    @{ tableNumber = "T-05"; capacity = 2; price = 0.0; status = "Booked"; cafe = @{ id = $cafeId } }
)

foreach ($table in $tables) {
    $json = $table | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/api/cafes/tables/add" -Method Post -Body $json -ContentType "application/json"
        Write-Host "Added table $($table.tableNumber)"
    } catch {
        Write-Host "Failed to add table $($table.tableNumber): $_"
    }
}
