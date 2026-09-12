"""Apresentação enxuta da primeira coleção. Dados permanecem em produtos.js/config.js."""
from html import escape

def catalog(products, base='./', heading=True):
    kinds = {'vestidos':'Vestidos', 'conjuntos-femininos':'Conjuntos', 'saias':'Saias', 'blusas':'Blusas e regatas', 'macacoes':'Macacões e macaquinhos'}
    categories = list(dict.fromkeys(p['categoria'] for p in products))
    sizes = [size for size in ['P','M','G','GG'] if any(size in p['tamanhos'] for p in products)]
    options = ''.join(f'<option value="{escape(kind)}">{kinds.get(kind,kind)}</option>' for kind in categories)
    size_options = ''.join(f'<option>{size}</option>' for size in sizes)
    title = '<div class="section-heading"><div><span class="eyebrow">ESCOLHA O SEU ESTILO</span><h2>Todos os modelos</h2></div></div>' if heading else ''
    return f'''<section id="colecao" class="container section launch-catalog" aria-label="Coleção inicial" data-category="all">
    {title}<p class="collection-note">Um card por modelo. Veja as cores e estampas nos detalhes.<br>Fotos fornecidas · Fale com a Zadoni no WhatsApp para consultar valor e disponibilidade.</p>
    <form id="filters" class="simple-filters" aria-label="Encontrar uma peça">
      <label>Tipo de peça<select name="categoria"><option value="">Todas as peças</option>{options}</select></label>
      <label>Tamanho<select name="tamanho"><option value="">Todos os tamanhos</option>{size_options}</select></label>
      <button type="reset" class="reset-filters">Limpar</button>
    </form><p id="result-count" class="collection-count" role="status" aria-live="polite"></p><div id="catalog-grid" class="grid"></div>
    <noscript><p>Ative o JavaScript para ver as peças da seleção.</p></noscript></section>'''

def home(products):
    return '''<section class="hero launch-hero"><div class="container hero-grid"><div class="hero-copy"><span class="eyebrow">ZADONI MODAS · CANAÃ DOS CARAJÁS</span><h1>Elegância para<br>todos os seus<br><em>momentos.</em></h1><p>Uma seleção de vestidos e conjuntos para vestir seus momentos com elegância.</p><a class="button" href="#colecao">Escolha sua peça →</a></div><div class="launch-photo editorial-card"><img src="./assets/img/serena.jpg" alt="Vestido longo oliva da seleção de fotos fornecidas à Zadoni" width="1086" height="1448" fetchpriority="high"></div></div></section>''' + catalog(products) + '''<section id="como-comprar" class="how-to-buy"><div class="container"><span class="eyebrow">SIMPLES, DO SEU JEITO</span><h2>Da escolha à conversa</h2><ol><li><span>01</span><h3>Escolha a peça</h3><p>Abra os detalhes do look que você gostou.</p></li><li><span>02</span><h3>Confira tamanho e cor</h3><p>Veja as opções e consulte o guia de medidas.</p></li><li><span>03</span><h3>Converse no WhatsApp</h3><p>Consulte disponibilidade e condições com a equipe.</p></li></ol><p class="collection-note">O atendimento será ativado quando o WhatsApp oficial estiver configurado.</p></div></section>'''

def footer(base):
    return f'''<footer><div class="container"><div class="launch-footer"><div><a class="logo" href="{base}">ZADONI<small>MODAS</small></a><p>Moda feminina elegante.<br>Canaã dos Carajás · PA.</p></div><nav aria-label="Ajuda e informações"><a href="{base}sobre/">Sobre a Zadoni</a><a href="{base}guia-de-tamanhos/">Guia de tamanhos</a><a href="{base}trocas-e-devolucoes/">Trocas e devoluções</a><a href="{base}contato/">Atendimento</a></nav><div><p>Quer saber o valor de uma peça?</p><button class="button secondary" data-whatsapp>Falar no WhatsApp ↗</button></div></div><div class="footer-bottom">© 2026 Zadoni Modas · Consulte valores e disponibilidade pelo WhatsApp.</div></div></footer>'''
