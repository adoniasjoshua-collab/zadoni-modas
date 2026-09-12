# Zadoni Modas

Loja estática de moda feminina, com foco em vestidos e uma seleção de moda modesta e evangélica. Criada para o mercado inicial de Canaã dos Carajás – PA e preparada para migração de hospedagem.

**Fase inicial enxuta:** quatro peças na vitrine (três vestidos e um conjunto), uma coleção e menu com Coleção, Como comprar e Atendimento. O fluxo principal é **escolher peça → conferir tamanho/cor → consultar no WhatsApp**. A home reúne banner, uma vitrine, três passos de compra e rodapé de ajuda.

**Ambiente DEMO:** nomes, tamanhos e disponibilidade são ilustrativos; os valores não são exibidos e devem ser consultados pelo WhatsApp. Não há vendas, checkout, estoque real, pagamentos ou backend. As quatro peças iniciais usam fotos fornecidas pelo usuário. Os seis registros originais continuam na fonte de dados, mas apenas os slugs selecionados em `assets/js/config.js` aparecem na vitrine, na busca e nas sugestões. Os arquivos de fotos originais foram preservados.

## Abrir localmente

Na pasta do projeto:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Abra **http://127.0.0.1:4173/**. Para encerrar, pressione Ctrl+C no terminal do servidor. HTML, CSS e JavaScript já estão gerados: não é necessário instalar dependências para executar o site. A home também renderiza ao abrir `index.html`, mas a navegação com URLs de diretório deve ser testada pelo servidor HTTP.

## Estrutura e manutenção

- `index.html`: home com a seleção inicial.
- `colecao/index.html`: catálogo único e destino da busca.
- Pastas de categorias preparadas para expansão, fora da navegação inicial: `vestidos`, `vestidos-midi`, `vestidos-longos`, `vestidos-elegantes`, `vestidos-para-festa`, `vestidos-evangelicos`, `conjuntos-femininos`, `saias`, `blusas`, `moda-modesta`, `moda-evangelica`, `lancamentos`, `mais-vendidos`, `ofertas`.
- Institucionais: `sobre`, `contato`, `guia-de-tamanhos`, `trocas-e-devolucoes`, `moda-feminina-canaa-dos-carajas`.
- `produto/index.html`: entrada do catálogo; `produto/<slug>/index.html`: páginas individuais.
- `blog`: índice e três artigos originais, fora da navegação inicial.
- `assets/data/produtos.js`: fonte única dos dados comerciais DEMO.
- `assets/js/config.js`: seleção inicial (`COLLECTION_SLUGS`), número do WhatsApp e URL pública.
- `assets/js/app.js`: renderização, pesquisa, filtros, ordenação, galeria e contato.
- `assets/css/style.css`: componentes e design system.
- `assets/img`: ilustrações originais; `assets/icons`: favicon.
- `scripts/launch_layout.py`: fonte da home, catálogo e rodapé enxutos.
- `scripts/build.py`: geração das páginas, textos institucionais e estrutura futura.
- `scripts/validate.py` e `scripts/browser-test.cjs`: verificações reproduzíveis.
- `404.html`, `robots.txt`, `.nojekyll`: suporte à publicação estática.
- `RELATORIO.md`: resultados de validação e pendências.

Os HTML são artefatos gerados. Edite a apresentação inicial em `scripts/launch_layout.py`, páginas auxiliares em `scripts/build.py`, dados em `produtos.js`, estilos no CSS e interações no JS. **Não mantenha alterações manuais nos HTML**, pois uma geração posterior as substitui. As páginas fora da navegação continuam acessíveis pelo endereço direto; não são privadas.

Para gerar novamente (Python 3 e Node.js necessários apenas nesta etapa):

```powershell
python scripts/build.py
python scripts/validate.py
node --check assets/js/app.js
```

O gerador não limpa páginas antigas: ao remover um produto ou mudar um slug, exclua explicitamente seu HTML antigo e planeje redirecionamentos antes de uma migração pública. Ele regrava as ilustrações DEMO: use nomes novos para fotos reais.

## Produtos e imagens

Para incluir ou retirar uma peça da seleção inicial, altere somente `COLLECTION_SLUGS` em `assets/js/config.js` e execute `python scripts/build.py`. A ordem da lista define a ordem da vitrine. O gerador verifica slugs inexistentes e duplicados. Para uma peça nova, cadastre primeiro seus dados em `produtos.js`. As opções de tipo e tamanho são geradas a partir da seleção; não é preciso criar novas categorias para aumentar a coleção.

Em `assets/data/produtos.js`, cada produto contém nome, slug único, categoria, preço interno, preço promocional opcional, cores, tamanhos, tecido, modelagem, disponibilidade DEMO, destaque, tags e descrição. Os preços permanecem na fonte para manutenção futura, mas não são exibidos na vitrine nem enviados nas mensagens. `imagem` define a capa e `imagens` contém o array da galeria. `imagensPorCor` associa cores a arquivos quando há fotos de variantes; o vestido longo já demonstra esse recurso. `fotoFornecida` diferencia fotografia de ilustração nos textos alternativos. A composição dos tecidos das peças fotografadas está a confirmar.

Use slugs com letras minúsculas, números e hífens. `tags` associa a peça às vitrines, como `vestidos-midi`, `lancamentos` e `moda-modesta`. `mais-vendidos` é uma seleção manual DEMO e não calcula vendas. `promocional: null` representa ausência de desconto. O filtro e a ordenação de preço usam o valor promocional quando presente.

Adicione as fotos autorizadas em `assets/img`, preferencialmente WebP ou AVIF com proporção 3:4. A vitrine já define dimensões e usa lazy loading; a imagem principal tem prioridade de carregamento. Atualize os textos alternativos e remova as indicações DEMO somente após substituir os dados por informações verificadas. Depois, execute o gerador para criar as páginas dos novos produtos.

## WhatsApp

Em `assets/js/config.js`, preencha `WHATSAPP_NUMBER` com código do país, DDD e número, somente dígitos. Nenhum número foi presumido.

O número vazio ou inválido abre um diálogo informativo, sem redirecionar para terceiros. Com número configurado, `window.Zadoni.whatsappURL(produto, selecao)` monta um link `wa.me` com nome, URL e, na página de produto, tamanho e cor selecionados para consulta de valor e disponibilidade. Os cards oferecem contato direto; imagem e nome continuam levando aos detalhes. A função também atende cabeçalho, rodapé e botão flutuante. O site não envia mensagens automaticamente.

## Busca e filtros

A busca do cabeçalho pesquisa **somente a seleção inicial**, por nome, categoria, tags e descrição, ignorando diferenças de acentuação e maiúsculas. A home e `/colecao/` oferecem apenas tipo de peça e tamanho, com contador anunciado para leitores de tela, limpar filtros e estado vazio. Os filtros avançados e a ordenação permanecem nas páginas de expansão, sem acesso pelo menu inicial. As sugestões também respeitam a seleção e exibem até duas peças.

## Design system e acessibilidade

A fase inicial usa um banner com uma foto, menu de três links, quatro cards e dois filtros. Cores e tamanhos aparecem como informações nos cards; a escolha ocorre na página da peça. Vitrines duplicadas, submenu, blog, ocasiões e depoimento DEMO saíram da home. A consulta anterior à referência e suas limitações estão em [REFERENCIA-VISUAL.md](REFERENCIA-VISUAL.md); o escopo atual foi reduzido para o início da operação.

Paleta: oliva `#344b3e`, areia `#f6f3ec`, texto `#292e29` e texto secundário `#64685f`. Fontes locais: Georgia para títulos; Arial/Helvetica para interface. Ritmo de espaçamento baseado em 8 px, bordas discretas, raio de 4 px e sombra leve. Componentes: container, botões primário/secundário, cards, badges, grids, vitrines, filtros, breadcrumb, menu e diálogo.

Layout adaptável, foco visível, link para pular ao conteúdo, campos rotulados, menu com estado expandido e fechamento por Escape, diálogo nativo com navegação por teclado. Não há bibliotecas, fontes remotas, rastreadores ou dependências de rede para renderizar o catálogo.

## Publicar no GitHub Pages

O projeto ainda não tem repositório remoto configurado. Não houve commit, push ou publicação.

1. Crie ou escolha um repositório exclusivo para **Zadoni Modas**. Não utilize Zadoni Presentes.
2. Versione os arquivos e envie ao repositório após confirmar o destino e as credenciais. Não inclua arquivos `.env` ou dados privados.
3. Em **Settings → Pages → Build and deployment**, selecione **Deploy from a branch**, a branch com os arquivos e a pasta **/(root)**.
4. Mantenha `.nojekyll` e `index.html` na raiz da fonte de publicação.
5. Teste a URL fornecida pelo GitHub, inclusive categorias e produtos em `/nome-do-repositorio/`.

Esse fluxo está descrito na [documentação oficial do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Todos os caminhos do catálogo são relativos à profundidade da página, permitindo publicação em subdiretório. A 404 tem conteúdo independente de assets e reconhece o primeiro segmento de um site de projeto em `github.io`.

## Indexação nesta fase

Todas as páginas possuem `<meta name="robots" content="noindex,nofollow">`. `robots.txt` contém `User-agent: *` e `Disallow: /`. Não há sitemap, Search Console, analytics ou configuração de domínio.

Esses mecanismos **não são controle de acesso nem garantia absoluta de ausência em índices**: o bloqueio de rastreamento pode impedir que o buscador leia o `noindex`. Em sites de projeto do GitHub Pages, o robô procura `/robots.txt` na raiz do host; o arquivo dentro de `/repositorio/` não controla o host. Se for essencial impedir acesso público, mantenha a prévia local ou use hospedagem com autenticação. Não foi alterada nenhuma página de usuário ou outro projeto para tentar controlar a raiz do host.

## SEO preparado e migração futura

Titles e descriptions únicos, um H1 por página, estrutura semântica, breadcrumbs, URLs limpas, Open Graph e Twitter Card. O canonical fica intencionalmente ausente enquanto `SITE_URL` não é definido, evitando atribuir um domínio fictício. Depois de configurar a URL completa em `config.js`, execute `python scripts/build.py` para emitir canonical e `og:url` no HTML estático. A configuração não remove noindex.

As imagens sociais atuais usam uma foto local do catálogo. Antes do lançamento, prepare uma imagem social autorizada (por exemplo, 1200 × 630), URLs absolutas e verifique a prévia nas plataformas. Não há marcação Product com avaliações/estoque fictícios.

Checklist para domínio próprio/Hostinger:

- [ ] Confirmar domínio, DNS, HTTPS e URL final com o responsável.
- [ ] Copiar os mesmos HTML e assets para a raiz pública; sem necessidade de backend.
- [ ] Atualizar `SITE_URL`, gerar as páginas e verificar canonicals e links.
- [ ] Confirmar redirecionamentos dos endereços anteriores e regras de 404 da hospedagem.
- [ ] Cadastrar produtos, fotos licenciadas, preços, medidas e disponibilidade reais.
- [ ] Cadastrar WhatsApp oficial e testar a mensagem sem efetuar um envio automático.
- [ ] Publicar informações da empresa, atendimento, entrega e política comercial revisada.
- [ ] Substituir/remover depoimento fictício e rótulos DEMO conforme a realidade.
- [ ] Definir checkout, estoque, banco de dados e analytics como integrações futuras separadas.
- [ ] Medir Lighthouse e acessibilidade na hospedagem final, com fotos reais.
- [ ] **Apenas com decisão expressa de lançamento indexável:** substituir a meta robots no gerador, regenerar todas as páginas, revisar robots na raiz do domínio e verificar o HTML publicado.
- [ ] Somente nessa fase criar sitemap, configurar Search Console e validar a descoberta das URLs.

## Testes no navegador

O teste opcional utiliza Playwright como ferramenta de desenvolvimento; ele não é dependência do site. Com o servidor local ativo e Playwright disponível:

```powershell
node scripts/browser-test.cjs CAMINHO_DO_MODULO_PLAYWRIGHT CAMINHO_DO_CHROME
```

São verificadas as larguras 320, 375, 390, 768, 1024 e 1440 px, menu com três links, seleção de quatro peças, filtros combinados, busca, exclusão das peças fora da seleção, detalhes, galeria, diálogo e mensagem WhatsApp com as opções escolhidas. Também são verificados os endereços auxiliares e a navegação em subdiretório. Capturas são gravadas em `test-results/`, ignorada pelo Git.
