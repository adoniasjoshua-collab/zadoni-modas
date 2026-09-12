# Zadoni Modas — fase inicial enxuta

A loja foi simplificada para começar com poucas peças e uma navegação curta. Não houve publicação, commit ou push. Nenhum outro projeto foi alterado.

## Estrutura em uso

- Menu: **Coleção · Como comprar · Atendimento**, sem submenus.
- Home: banner com uma foto, coleção única, três passos de compra e ajuda no rodapé.
- Quatro peças com fotos: Vestido Midi Aurora, Vestido Longo Serena, Conjunto Essência e Vestido Midi Florença.
- Dois filtros: tipo e tamanho. A busca considera somente essas peças.
- Cards com uma ação principal para **Falar no WhatsApp**. O valor não é exibido; tamanho e cor são escolhidos nos detalhes antes da consulta.
- Até duas sugestões de outras peças da seleção.
- Número oficial de WhatsApp pendente; sem ele, um diálogo informa que o atendimento está em preparação.

As vitrines repetidas, categorias detalhadas, blog, ocasiões e depoimento DEMO saíram da navegação inicial. A fonte dos seis produtos e as páginas preparadas para crescimento permanecem no projeto e são acessíveis por URL direta; não são privadas.

## Manutenção

`assets/js/config.js` define a seleção em `COLLECTION_SLUGS`, na ordem desejada. Para mudar as peças, altere os slugs e execute `python scripts/build.py`. O gerador verifica que os slugs existem e não se repetem. Tipos e tamanhos disponíveis nos filtros acompanham automaticamente a seleção.

`scripts/launch_layout.py` reúne a apresentação inicial. `scripts/build.py` mantém a geração e as páginas auxiliares. Existem 33 documentos HTML, incluindo `/colecao/`; esse total representa a estrutura preparada, não o número de opções no menu.

## Validação

- 33 páginas com links locais válidos, um H1 por documento, titles únicos, imagens com alt/dimensões e NOINDEX.
- Chrome/Playwright em 320, 375, 390, 768, 1024 e 1440 px, sem transbordamento horizontal na home, coleção e produto.
- Menu mobile e Escape, filtros, limpar busca, estado vazio e exclusão de peças fora da seleção.
- Fluxo coleção → detalhes → seleção de tamanho/cor → mensagem WhatsApp, sem envio de mensagens.
- Galeria e variantes oliva/preta do vestido longo.
- Navegação sob `/preview/`, simulando o subdiretório do GitHub Pages.
- Todas as páginas auxiliares percorridas em 390 px, sem erros JavaScript ou de console.
- Capturas da versão enxuta em `test-results/home-1440.png`, `home-390.png`, `category-1440.png` e `category-390.png`.

Não foi executado Lighthouse; nenhuma pontuação é presumida. Os assets são locais, as fotos originais foram preservadas e as imagens da vitrine usam dimensões explícitas e carregamento sob demanda.

## Pendências

WhatsApp oficial, valores, medidas, composição, estoque e condições comerciais reais; dados da empresa; repositório e publicação. Os dados continuam DEMO. A identidade e as fotos da Zadoni foram mantidas; a referência anterior está documentada em `REFERENCIA-VISUAL.md`.

`noindex,nofollow` e `robots.txt` permanecem ativos, sem sitemap ou Search Console. Diretivas de buscadores não equivalem a autenticação; no GitHub Pages, robots deve estar na raiz do host para ser aplicável.
