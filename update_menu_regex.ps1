$files = @("home.html", "index.html", "slim-one.html", "outros-tratamentos.html", "sobre.html", "sobre-mim.html", "duvidas.html", "faq.html", "contato.html")

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content -Raw -Encoding UTF8 -Path $f
        
        # Prevent double adding by first removing any existing limpeza-de-pele link next to Dúvidas
        $content = $content -replace '(?s)(<a href="duvidas\.html"[^>]*>Dúvidas</a>)\s*<a href="limpeza-de-pele\.html"[^>]*>Limpeza de Pele</a>', '$1'
        
        # Add Limpeza de Pele after Duvidas
        $content = $content -replace '(<a href="duvidas\.html"[^>]*>Dúvidas</a>)', "`$1`n                <a href=`"limpeza-de-pele.html`">Limpeza de Pele</a>"
        
        # Fix inline grids
        $content = $content -replace 'style="grid-template-columns: 1\.1fr 0\.9fr;"', ''
        $content = $content -replace 'style="grid-template-columns: 1fr 1fr; align-items: stretch;"', 'class="hero-grid grid-equal grid-stretch"'
        $content = $content -replace 'class="hero-grid" style="grid-template-columns: 1fr 1fr; align-items: start;"', 'class="hero-grid grid-equal grid-start"'
        $content = $content -replace 'class="container hero-grid" style="grid-template-columns: 1fr 1fr;"', 'class="container hero-grid grid-equal"'
        $content = $content -replace 'class="timeline reveal" style="grid-template-columns: repeat\(4, 1fr\);"', 'class="timeline grid-4 reveal"'
        
        Set-Content -Path $f -Value $content -Encoding UTF8
        Write-Host "Updated $f"
    }
}
