import glob

files = [
    "home.html", "index.html", "slim-one.html", "outros-tratamentos.html", 
    "sobre.html", "sobre-mim.html", "duvidas.html", "faq.html", "contato.html"
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()

        # Update nav-links
        old_nav = """            <nav class="nav-links">
                <a href="slim-one.html">Slim One</a>
                <a href="outros-tratamentos.html">Outros Tratamentos</a>
                <a href="sobre.html">Sobre a Tatiane</a>
                <a href="duvidas.html">Dúvidas</a>
            </nav>"""
        new_nav = """            <nav class="nav-links">
                <a href="slim-one.html">Slim One</a>
                <a href="outros-tratamentos.html">Outros Tratamentos</a>
                <a href="limpeza-de-pele.html">Limpeza de Pele</a>
                <a href="sobre.html">Sobre a Tatiane</a>
                <a href="duvidas.html">Dúvidas</a>
            </nav>"""
        
        # Handle active classes
        old_nav_active = old_nav.replace('<a href="slim-one.html">Slim One</a>', '<a href="slim-one.html" class="active">Slim One</a>')
        new_nav_active = new_nav.replace('<a href="slim-one.html">Slim One</a>', '<a href="slim-one.html" class="active">Slim One</a>')
        content = content.replace(old_nav_active, new_nav_active)

        old_nav_active2 = old_nav.replace('<a href="outros-tratamentos.html">Outros Tratamentos</a>', '<a href="outros-tratamentos.html" class="active">Outros Tratamentos</a>')
        new_nav_active2 = new_nav.replace('<a href="outros-tratamentos.html">Outros Tratamentos</a>', '<a href="outros-tratamentos.html" class="active">Outros Tratamentos</a>')
        content = content.replace(old_nav_active2, new_nav_active2)

        old_nav_active3 = old_nav.replace('<a href="sobre.html">Sobre a Tatiane</a>', '<a href="sobre.html" class="active">Sobre a Tatiane</a>')
        new_nav_active3 = new_nav.replace('<a href="sobre.html">Sobre a Tatiane</a>', '<a href="sobre.html" class="active">Sobre a Tatiane</a>')
        content = content.replace(old_nav_active3, new_nav_active3)

        old_nav_active4 = old_nav.replace('<a href="duvidas.html">Dúvidas</a>', '<a href="duvidas.html" class="active">Dúvidas</a>')
        new_nav_active4 = new_nav.replace('<a href="duvidas.html">Dúvidas</a>', '<a href="duvidas.html" class="active">Dúvidas</a>')
        content = content.replace(old_nav_active4, new_nav_active4)

        content = content.replace(old_nav, new_nav)

        # Update mobile-menu
        old_mobile = """    <div class="mobile-menu" id="mobile-menu">
        <a href="slim-one.html">Slim One</a>
        <a href="outros-tratamentos.html">Outros Tratamentos</a>
        <a href="sobre.html">Sobre a Tatiane</a>
        <a href="duvidas.html">Dúvidas</a>
        <a href="contato.html">Contato</a>"""
        new_mobile = """    <div class="mobile-menu" id="mobile-menu">
        <a href="slim-one.html">Slim One</a>
        <a href="outros-tratamentos.html">Outros Tratamentos</a>
        <a href="limpeza-de-pele.html">Limpeza de Pele</a>
        <a href="sobre.html">Sobre a Tatiane</a>
        <a href="duvidas.html">Dúvidas</a>
        <a href="contato.html">Contato</a>"""
        content = content.replace(old_mobile, new_mobile)

        # Update footer links
        old_footer = """                    <div class="footer-links">
                        <a href="slim-one.html">Slim One</a>
                        <a href="outros-tratamentos.html">Outros Tratamentos</a>
                        <a href="sobre.html">Sobre a Tatiane</a>
                        <a href="duvidas.html">Dúvidas</a>
                        <a href="contato.html">Contato</a>
                    </div>"""
        new_footer = """                    <div class="footer-links">
                        <a href="slim-one.html">Slim One</a>
                        <a href="outros-tratamentos.html">Outros Tratamentos</a>
                        <a href="limpeza-de-pele.html">Limpeza de Pele</a>
                        <a href="sobre.html">Sobre a Tatiane</a>
                        <a href="duvidas.html">Dúvidas</a>
                        <a href="contato.html">Contato</a>
                    </div>"""
        content = content.replace(old_footer, new_footer)

        # Update hero-grid inline styles for responsiveness
        content = content.replace('style="grid-template-columns: 1.1fr 0.9fr;"', '')
        content = content.replace('style="grid-template-columns: 1fr 1fr; align-items: stretch;"', 'class="hero-grid grid-equal grid-stretch"')
        content = content.replace('class="hero-grid" style="grid-template-columns: 1fr 1fr; align-items: start;"', 'class="hero-grid grid-equal grid-start"')
        content = content.replace('class="container hero-grid" style="grid-template-columns: 1fr 1fr;"', 'class="container hero-grid grid-equal"')
        content = content.replace('class="timeline reveal" style="grid-template-columns: repeat(4, 1fr);"', 'class="timeline grid-4 reveal"')
        
        # fix the class="hero-grid class="hero-grid..." if it happened
        content = content.replace('class="hero-grid class="', 'class="')
        content = content.replace('class="container hero-grid class="', 'class="container ')

        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
    except Exception as e:
        print(f"Error updating {f}: {e}")
