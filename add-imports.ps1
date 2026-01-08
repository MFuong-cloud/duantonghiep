# Script to apply AdminPageLayout to remaining admin pages
Write-Host "Applying AdminPageLayout to admin pages..." -ForegroundColor Cyan

$pages = @(
    @{
        Path = "src\app\admin\menu-items\page.tsx"
        StartPattern = 'return \('
        HeaderStart = '\s+<AdminCard>'
        HeaderEnd = '</div>\s+{/\* Table \*/}'
        ContentStart = '{/\* Table \*/}'
        ContentEnd = '</AdminCard>'
    }
)

foreach ($pageInfo in $pages) {
    $file = Join-Path "e:\laragon\www\FE - Copy" $pageInfo.Path
    
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Add import if not exists
        if ($content -notmatch 'import AdminPageLayout') {
            $content = $content -replace '("use client";)', "`$1`nimport AdminPageLayout from `"@/components/admin/layout/AdminPageLayout`";"
        }
        
        Write-Host "Updated: $($pageInfo.Path)" -ForegroundColor Green
        Set-Content $file -Value $content -NoNewline -Encoding UTF8
    }
}

Write-Host "`nCompleted!" -ForegroundColor Green
