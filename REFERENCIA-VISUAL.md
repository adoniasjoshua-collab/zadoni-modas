# Referência de loja — Via Tolentino

**Escopo atual:** a pedido do usuário, a apresentação foi reduzida para quatro peças, uma coleção, três links no menu e dois filtros. Os recursos descritos abaixo registram a revisão anterior; submenu, vitrines repetidas e blocos editoriais não fazem parte da home inicial atual.

A ZAMORE recebeu uma revisão de apresentação e navegação após a solicitação de usar a loja de inspiração.

## O que foi possível consultar

Em 12/09/2026, a abertura direta da home e da categoria de vestidos da Via Tolentino retornou HTTP 403 tanto na ferramenta de pesquisa quanto no Chrome. Portanto, **não foi possível confirmar o layout visual atual**.

Foi consultado o conteúdo indexado de páginas do próprio domínio:

- [Home antiga da Via Tolentino](https://www.viatolentino.com.br/home_antiga): organização em categorias, vitrines, campanha de coleção, navegação por tamanho e conteúdo editorial. Essa URL é explicitamente uma home antiga; não comprova a aparência atual.
- [Categoria de vestidos](https://www.viatolentino.com.br/feminino/roupas/vestidos?p=3): contador de produtos e conteúdo complementar sobre tipos de vestido.

Não foram reutilizados código, fotografias, textos comerciais, nomes de coleção ou identidade da referência. Não foi feita uma comparação visual por capturas da loja, pois as capturas disponíveis mostraram apenas o bloqueio 403.

## Aplicação na ZAMORE

- Cabeçalho com marca centralizada no desktop e busca acessível.
- Banner editorial próprio, com duas fotos fornecidas pelo usuário e a comunicação da ZAMORE.
- Menu de vestidos com atalhos para comprimentos e ocasiões, utilizável por teclado e no celular.
- Categorias com fotos retangulares e vitrines com detalhes de cor, preço e tamanho.
- Seleção por tamanho na home: navega para o catálogo já filtrado em P, M, G ou GG, conforme os dados DEMO existentes.
- Atalhos de tamanho nos cards que abrem o produto com a opção escolhida.
- Categoria com filtros laterais no desktop e painel recolhível no celular; contador e ordenação junto à vitrine.
- Conteúdo editorial ilustrado com fotos do próprio acervo fornecido.

O banner, as cores oliva/areia, a composição visual e os textos são decisões de design próprias da Zadoni. As funcionalidades comerciais aproveitam os princípios encontrados no conteúdo consultado; não representam uma reprodução do visual atual da Via Tolentino.

## Verificação

32 páginas com links válidos e NOINDEX. Testes Chrome/Playwright aprovados em 320, 375, 390, 768, 1024 e 1440 px. Verificados submenu/Escape, filtro mobile, navegação por tamanho, tamanho pré-selecionado no produto, busca, demais filtros, ordenação, galeria e WhatsApp. Capturas finais em `test-results/home-1440.png`, `home-390.png`, `category-1440.png` e `category-390.png`.
