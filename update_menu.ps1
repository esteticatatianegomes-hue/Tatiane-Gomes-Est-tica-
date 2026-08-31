$files = @("home.html", "index.html", "slim-one.html", "outros-tratamentos.html", "sobre.html", "sobre-mim.html", "duvidas.html", "faq.html", "contato.html")

$oldNav = @"
            <nav class="nav-links">
                <a href="slim-one.html">Slim One</a>
                <a href="outros-tratamentos.html">Outros Tratamentos</a>
                <a href="sobre.html">Sobre a Tatiane</a>
                <a href="duvidas.html">Dúvidas</a>
            </nav>
"@
$newNav = @"
            <nav class="nav-links">
                <a href="slim-one.html">Slim One</a>
                <a href="outros-tratamentos.html">Outros Tratamentos</a>
                <a href="sobre.html">Sobre a Tatiane</a>
                <a href="duvidas.html">Dúvidas</a>
                <a href="limpeza-de-pele.html">Limpeza de Pele</a>
            </nav>
"@

$oldMobile = @"
    <div class="mobile-menu" id="mobile-menu">
        <a href="slim-one.html">Slim One</a>
        <a href="outros-tratamentos.html">Outros Tratamentos</a>
        <a href="sobre.html">Sobre a Tatiane</a>
        <a href="duvidas.html">Dúvidas</a>
        <a href="contato.html">Contato</a>
"@
$newMobile = @"
    <div class="mobile-menu" id="mobile-menu">
        <a href="slim-one.html">Slim One</a>
        <a href="outros-tratamentos.html">Outros Tratamentos</a>
        <a href="sobre.html">Sobre a Tatiane</a>
        <a href="duvidas.html">Dúvidas</a>
        <a href="limpeza-de-pele.html">Limpeza de Pele</a>
        <a href="contato.html">Contato</a>
"@

$oldFooter = @"
                    <div class="footer-links">
                        <a href="slim-one.html">Slim One</a>
                        <a href="outros-tratamentos.html">Outros Tratamentos</a>
                        <a href="sobre.html">Sobre a Tatiane</a>
                        <a href="duvidas.html">Dúvidas</a>
                        <a href="contato.html">Contato</a>
                    </div>
"@
$newFooter = @"
                    <div class="footer-links">
                        <a href="slim-one.html">Slim One</a>
                        <a href="outros-tratamentos.html">Outros Tratamentos</a>
                        <a href="sobre.html">Sobre a Tatiane</a>
                        <a href="duvidas.html">Dúvidas</a>
                        <a href="limpeza-de-pele.html">Limpeza de Pele</a>
                        <a href="contato.html">Contato</a>
                    </div>
"@

foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content -Raw -Encoding UTF8 -Path $f

        # Replace exact blocks
        $content = $content.Replace($oldNav, $newNav)
        $content = $content.Replace($oldMobile, $newMobile)
        $content = $content.Replace($oldFooter, $newFooter)

        # Handle active classes for nav
        $oldNavSlimActive = $oldNav.Replace('<a href="slim-one.html">Slim One</a>', '<a href="slim-one.html" class="active">Slim One</a>')
        $newNavSlimActive = $newNav.Replace('<a href="slim-one.html">Slim One</a>', '<a href="slim-one.html" class="active">Slim One</a>')
        $content = $content.Replace($oldNavSlimActive, $newNavSlimActive)

        $oldNavOutrosActive = $oldNav.Replace('<a href="outros-tratamentos.html">Outros Tratamentos</a>', '<a href="outros-tratamentos.html" class="active">Outros Tratamentos</a>')
        $newNavOutrosActive = $newNav.Replace('<a href="outros-tratamentos.html">Outros Tratamentos</a>', '<a href="outros-tratamentos.html" class="active">Outros Tratamentos</a>')
        $content = $content.Replace($oldNavOutrosActive, $newNavOutrosActive)

        $oldNavSobreActive = $oldNav.Replace('<a href="sobre.html">Sobre a Tatiane</a>', '<a href="sobre.html" class="active">Sobre a Tatiane</a>')
        $newNavSobreActive = $newNav.Replace('<a href="sobre.html">Sobre a Tatiane</a>', '<a href="sobre.html" class="active">Sobre a Tatiane</a>')
        $content = $content.Replace($oldNavSobreActive, $newNavSobreActive)

        $oldNavDuvidasActive = $oldNav.Replace('<a href="duvidas.html">Dúvidas</a>', '<a href="duvidas.html" class="active">Dúvidas</a>')
        $newNavDuvidasActive = $newNav.Replace('<a href="duvidas.html">Dúvidas</a>', '<a href="duvidas.html" class="active">Dúvidas</a>')
        $content = $content.Replace($oldNavDuvidasActive, $newNavDuvidasActive)
        
        $oldNavContatoActive = $oldNav.Replace('<a href="contato.html">Contato</a>', '<a href="contato.html" class="active">Contato</a>')
        $newNavContatoActive = $newNav.Replace('<a href="contato.html">Contato</a>', '<a href="contato.html" class="active">Contato</a>')
        $content = $content.Replace($oldNavContatoActive, $newNavContatoActive)

        # Fix inline grids
        $content = $content.Replace('style="grid-template-columns: 1.1fr 0.9fr;"', '')
        $content = $content.Replace('style="grid-template-columns: 1fr 1fr; align-items: stretch;"', 'class="hero-grid grid-equal grid-stretch"')
        $content = $content.Replace('class="hero-grid" style="grid-template-columns: 1fr 1fr; align-items: start;"', 'class="hero-grid grid-equal grid-start"')
        $content = $content.Replace('class="container hero-grid" style="grid-template-columns: 1fr 1fr;"', 'class="container hero-grid grid-equal"')
        $content = $content.Replace('class="timeline reveal" style="grid-template-columns: repeat(4, 1fr);"', 'class="timeline grid-4 reveal"')
        
        $content = $content.Replace('class="hero-grid class="', 'class="')
        $content = $content.Replace('class="container hero-grid class="', 'class="container ')

        Set-Content -Path $f -Value $content -Encoding UTF8
        Write-Host "Updated $f"
    }
}
