# Seed database via API
Write-Host "🌱 Seeding database via API..." -ForegroundColor Cyan

$products = @(
    @{ code = "SNACK001"; name = "Indomie Goreng"; price = 3500; stock = 100 },
    @{ code = "SNACK002"; name = "Chitato BBQ"; price = 8000; stock = 50 },
    @{ code = "DRINK001"; name = "Aqua 600ml"; price = 4000; stock = 75 },
    @{ code = "DRINK002"; name = "Teh Botol Sosro"; price = 5000; stock = 60 },
    @{ code = "CANDY001"; name = "Kopiko Coffee Candy"; price = 2000; stock = 120 },
    @{ code = "BISCUIT001"; name = "Oreo Original"; price = 10000; stock = 40 },
    @{ code = "MILK001"; name = "Susu Ultra Coklat"; price = 6500; stock = 30 },
    @{ code = "BREAD001"; name = "Roti Tawar Sari Roti"; price = 15000; stock = 25 },
    @{ code = "SOAP001"; name = "Sabun Lifebuoy"; price = 7000; stock = 45 },
    @{ code = "SHAMPOO001"; name = "Pantene Sachet"; price = 1500; stock = 8 },
    @{ code = "TISSUE001"; name = "Tisu Paseo"; price = 12000; stock = 2 },
    @{ code = "EGGS001"; name = "Telur Ayam (10 butir)"; price = 25000; stock = 0 }
)

$successCount = 0
$failCount = 0

foreach ($product in $products) {
    $body = $product | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Post -Body $body -ContentType "application/json"
        Write-Host "✓ Created: $($product.name) ($($product.code))" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "✗ Failed: $($product.name) - $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
    Start-Sleep -Milliseconds 200
}

Write-Host "`n✅ Seeding complete!" -ForegroundColor Green
Write-Host "   Success: $successCount products" -ForegroundColor Green
Write-Host "   Failed: $failCount products" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Gray" })
Write-Host "`n📊 Sample data includes:" -ForegroundColor Cyan
Write-Host "   - In Stock: 9 products"
Write-Host "   - Low Stock (< 10): 2 products"
Write-Host "   - Out of Stock: 1 product"
