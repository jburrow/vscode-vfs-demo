# PowerShell Example - Demonstrates functions, objects, and pipelines
# Use this file to validate PowerShell extension support on VFS

#Requires -Version 5.1

# Script parameters
param(
    [Parameter(Mandatory = $false)]
    [string]$Name = "World",
    
    [Parameter(Mandatory = $false)]
    [switch]$Verbose
)

# Custom class definition
class Product {
    [int]$Id
    [string]$Name
    [decimal]$Price
    [string]$Category
    
    Product([int]$id, [string]$name, [decimal]$price, [string]$category) {
        $this.Id = $id
        $this.Name = $name
        $this.Price = $price
        $this.Category = $category
    }
    
    [string] ToString() {
        return "[$($this.Id)] $($this.Name) - `$$($this.Price)"
    }
}

# Function with pipeline support
function Get-ProductsByCategory {
    [CmdletBinding()]
    param(
        [Parameter(ValueFromPipeline = $true)]
        [Product[]]$Products,
        
        [Parameter(Mandatory = $true)]
        [string]$Category
    )
    
    process {
        foreach ($product in $Products) {
            if ($product.Category -eq $Category) {
                $product
            }
        }
    }
}

# Function with error handling
function Get-ProductStats {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [Product[]]$Products
    )
    
    try {
        $stats = [PSCustomObject]@{
            TotalCount = $Products.Count
            TotalValue = ($Products | Measure-Object -Property Price -Sum).Sum
            AveragePrice = ($Products | Measure-Object -Property Price -Average).Average
            Categories = ($Products | Select-Object -ExpandProperty Category -Unique)
        }
        
        return $stats
    }
    catch {
        Write-Error "Failed to calculate stats: $_"
        return $null
    }
}

# Create sample products
$products = @(
    [Product]::new(1, "Laptop", 999.99, "Electronics")
    [Product]::new(2, "Mouse", 29.99, "Electronics")
    [Product]::new(3, "Desk", 299.99, "Furniture")
    [Product]::new(4, "Chair", 199.99, "Furniture")
    [Product]::new(5, "Monitor", 349.99, "Electronics")
)

# Display all products
Write-Host "All Products:" -ForegroundColor Cyan
$products | ForEach-Object { Write-Host "  $($_.ToString())" }

# Filter by category using pipeline
Write-Host "`nElectronics:" -ForegroundColor Cyan
$products | Get-ProductsByCategory -Category "Electronics" | ForEach-Object {
    Write-Host "  $($_.Name): `$$($_.Price)"
}

# Get statistics
Write-Host "`nStatistics:" -ForegroundColor Cyan
$stats = Get-ProductStats -Products $products
Write-Host "  Total Products: $($stats.TotalCount)"
Write-Host "  Total Value: `$$($stats.TotalValue)"
Write-Host "  Average Price: `$$([math]::Round($stats.AveragePrice, 2))"
Write-Host "  Categories: $($stats.Categories -join ', ')"

# Hash table operations
$categoryTotals = @{}
$products | ForEach-Object {
    if (-not $categoryTotals.ContainsKey($_.Category)) {
        $categoryTotals[$_.Category] = 0
    }
    $categoryTotals[$_.Category] += $_.Price
}

Write-Host "`nCategory Totals:" -ForegroundColor Cyan
$categoryTotals.GetEnumerator() | Sort-Object Name | ForEach-Object {
    Write-Host "  $($_.Key): `$$($_.Value)"
}
