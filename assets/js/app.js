(() => {
 'use strict';
 const base = document.body.dataset.base || './';
 const allProducts = window.ZADONI_PRODUCTS;
 const config = window.ZADONI_CONFIG;
 const slugs=config.COLLECTION_SLUGS ?? allProducts.filter(p=>p.preco != null || p.promocional != null).map(p=>p.slug);
 const products = slugs.map(slug=>allProducts.find(p=>p.slug===slug)).filter(Boolean);
 const money = value => value == null ? 'Valor a confirmar' : new Intl.NumberFormat('pt-BR', {style:'currency',currency:'BRL'}).format(value);
 const price = p => p.promocional ?? p.preco;
 const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const matches = (p,tag) => tag === 'all' || p.categoria === tag || p.tags.includes(tag);
 const productURL = p => new URL(`${base}produto/${p.slug}/`,location.href).href;
 const detailURL = p => `${base}produto/${p.slug}/`;
 const imageAlt = p => `${p.fotoFornecida ? 'Foto fornecida para a seleção DEMO' : 'Ilustração DEMO'}: ${p.nome}`;
 const availability = p => p.disponivel == null ? 'Disponibilidade a confirmar' : p.disponivel ? 'Disponibilidade DEMO' : 'Indisponível · DEMO';
 function card(p) {
  const colors = {Preto:'#282826',Oliva:'#657452',Areia:'#c4b397','Azul-marinho':'#23364d',Vermelho:'#a83f38',Marrom:'#765443',Vinho:'#743846',Rosa:'#dfa8b4',Rosé:'#cba699',Verde:'#77a568','Fúcsia':'#ae398c',Amarelo:'#eddb91',Chumbo:'#575a5d','Amarelo-lima':'#d5df62','Azul-royal':'#2451a0',Cinza:'#858a8d',Roxo:'#8b3ca0',Branco:'#f5f1e8',Bege:'#cfb79d','Azul-claro':'#97d2d4',Laranja:'#dc9b61',Multicolorido:'linear-gradient(135deg,#377aa0,#d7a644,#b94c55)'};
  const swatches = p.cores.map(color=>`<span class="color-swatch" style="--swatch:${colors[color] || colors[color.split(' ')[0]] || '#888'}" title="${escape(color)}"><span class="sr-only">${escape(color)}</span></span>`).join('');
  const sizes = p.tamanhos.map(escape).join(' · ');
  return `<article class="product-card" data-model="${escape(p.slug)}">
   <a class="product-image" href="${detailURL(p)}"><img src="${base}assets/img/${escape(p.imagem)}" alt="${escape(imageAlt(p))}" width="600" height="800" loading="lazy"><span class="badge">${p.promocional ? 'OFERTA · DEMO' : 'SELEÇÃO DEMO'}</span><span class="view-product">Conhecer a peça →</span></a>
   <div class="product-colors" aria-label="Cores da seleção">${swatches}</div>
   <p class="variant-count">${p.cores.length === 1 ? '1 variação' : `${p.cores.length} variações`} de cor ou estampa</p>
   <h3><a href="${detailURL(p)}">${escape(p.nome)}</a></h3>
   <div class="price">${p.promocional ? `<del>${money(p.preco)}</del>` : ''}<strong>${money(price(p))}</strong></div>
   <p class="card-size-summary">Tamanhos ${sizes}</p>
   <p class="card-meta">${availability(p)}</p>
    <button class="button secondary card-detail" type="button" data-whatsapp="${escape(p.slug)}">Falar no WhatsApp ↗</button></article>`;
 }
 document.querySelectorAll('[data-product-grid]').forEach(el => {
  el.innerHTML = products.filter(p => matches(p,el.dataset.productGrid)).slice(0,Number(el.dataset.limit)).map(card).join('');
 });
 const toggle = document.querySelector('.menu-toggle');
 const navigation = document.querySelector('#navigation');
 const dressMenu = document.querySelector('.dress-menu');
 function closeMenu() { toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');navigation.classList.remove('open');if(dressMenu)dressMenu.open=false; }
 toggle.addEventListener('click',() => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open ? 'Fechar menu' : 'Abrir menu');navigation.classList.toggle('open',open); });
 document.addEventListener('keydown',event => {if(event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true'){closeMenu();toggle.focus();}});
 document.addEventListener('keydown',event => {if(event.key === 'Escape' && dressMenu?.open){dressMenu.open=false;dressMenu.querySelector('summary').focus();}});
 document.addEventListener('click',event=>{if(dressMenu?.open && !dressMenu.contains(event.target))dressMenu.open=false;});
 const filterForm = document.querySelector('#filters');
 const query = new URLSearchParams(location.search).get('q') || '';
 let searchTerm = query;
 document.querySelector('.search input').value = query;
 if(filterForm) {
  const scope = document.querySelector('[data-category]').dataset.category;
  const globalSearch = new URLSearchParams(location.search).has('q');
  const initialTitle=document.title;
  const initialHeading=document.querySelector('h1').textContent;
  const initialIntro=document.querySelector('.page-intro p')?.textContent;
  if(globalSearch) {
   document.querySelector('h1').textContent = 'Busca no catálogo';
   const intro = document.querySelector('.page-intro p');
   if(intro)intro.textContent = query ? `Resultados para “${query}” na seleção inicial.` : 'Explore as peças da seleção inicial.';
   document.title = 'Busca no catálogo | ZAMORE · Moda Feminina';
  }
  if(filterForm.elements.busca)filterForm.elements.busca.value = query;
  const sizeQuery = new URLSearchParams(location.search).get('tamanho');
  if(['P','M','G','GG'].includes(sizeQuery)) filterForm.elements.tamanho.value=sizeQuery;
  const filterPanel=document.querySelector('#filter-panel');
  const mobileFilters=matchMedia('(max-width: 767px)');
  const adaptFilters=()=>{if(filterPanel)filterPanel.open=!mobileFilters.matches;};
  adaptFilters();mobileFilters.addEventListener('change',adaptFilters);
  function render() {
   const values = Object.fromEntries(new FormData(filterForm));
   const term = normalize((values.busca ?? searchTerm).trim());
   let list = products.filter(p => (globalSearch || matches(p,scope)) && (!values.categoria || p.categoria === values.categoria) && (!values.tamanho || p.tamanhos.includes(values.tamanho)) && (!values.cor || p.cores.includes(values.cor)) && (values.preco == null || values.preco === '' || (price(p)!=null && price(p) <= Number(values.preco))) && (!values.destaque || p.destaque) && (!values.disponivel || p.disponivel === (values.disponivel === 'sim')) && (!term || normalize([p.nome,p.categoria.replaceAll('-',' '),p.descricao,...p.tags.map(t=>t.replaceAll('-',' '))].join(' ')).includes(term)));
   const sort = document.querySelector('#sort')?.value || 'relevancia';
   list.sort(sort === 'menor' ? (a,b)=>(price(a)??Infinity)-(price(b)??Infinity) : sort === 'maior' ? (a,b)=>(price(b)??-Infinity)-(price(a)??-Infinity) : sort === 'nome' ? (a,b)=>a.nome.localeCompare(b.nome,'pt-BR') : (a,b)=>Number(b.destaque)-Number(a.destaque));
   document.querySelector('#result-count').textContent = `${list.length} ${list.length === 1 ? 'modelo encontrado' : 'modelos encontrados'} · DEMO`;
   document.querySelector('#catalog-grid').innerHTML = list.length ? list.map(card).join('') : '<div class="empty"><h2>Nenhuma peça encontrada</h2><p>Experimente outra busca ou limpe os filtros.</p></div>';
  }
  filterForm.addEventListener('input',render);filterForm.addEventListener('change',render);
  filterForm.addEventListener('submit',e => e.preventDefault());
  filterForm.addEventListener('reset',() => {searchTerm='';document.querySelector('.search input').value='';const url=new URL(location.href);url.searchParams.delete('q');url.searchParams.delete('tamanho');history.replaceState(null,'',url);document.title=initialTitle;document.querySelector('h1').textContent=initialHeading;if(initialIntro)document.querySelector('.page-intro p').textContent=initialIntro;setTimeout(render,0);});
  document.querySelector('#sort')?.addEventListener('change',render);render();
 }
 const detail = document.querySelector('[data-product]');
 if(detail) {
  const p = allProducts.find(item => item.slug === detail.dataset.product);
  if(p) {
   const options = items => items.map(item=>`<option value="${escape(item)}">${escape(item)}</option>`).join('');
   detail.innerHTML = `<article class="product-detail"><img src="${base}assets/img/${escape(p.imagem)}" alt="Ilustração DEMO: ${escape(p.nome)}" width="600" height="800" fetchpriority="high"><div><a class="eyebrow" href="${base}${p.categoria}/">${escape(p.categoria.replaceAll('-',' '))}</a><h1>${escape(p.nome)}</h1><p class="price">${p.promocional ? `<del>${money(p.preco)}</del>` : ''}<strong>${money(price(p))}</strong></p><p>${escape(p.descricao)}</p><p class="demo-note">Consulte disponibilidade e condições falando com a ZAMORE no WhatsApp.</p><div class="product-options"><label>Tamanho<select id="product-size">${options(p.tamanhos)}</select></label><label>Cor<select id="product-color">${options(p.cores)}</select></label></div><a class="text-link" href="${base}guia-de-tamanhos/">Como escolher meu tamanho ↗</a><div class="buttons"><button class="button" data-whatsapp="${escape(p.slug)}">Falar sobre esta peça no WhatsApp ↗</button></div><p class="card-meta">Disponibilidade a confirmar pelo WhatsApp</p><h2>Sobre a peça</h2><dl><dt>Tecido</dt><dd>${escape(p.tecido)}</dd><dt>Modelagem</dt><dd>${escape(p.modelagem)}</dd><dt>Cores</dt><dd>${escape(p.cores.join(', '))}</dd></dl><details><summary>Entrega e atendimento</summary><p>A entrega local está em planejamento. Condições e prazos serão informados no atendimento.</p></details><details><summary>Trocas e devoluções</summary><p>As condições serão publicadas antes da abertura das vendas. <a href="${base}trocas-e-devolucoes/">Consulte o status das informações.</a></p></details></div></article>`;
   detail.querySelector('.product-detail .demo-note').textContent = 'Consulte disponibilidade e condições falando com a ZAMORE no WhatsApp.';
   detail.querySelector('.product-detail .card-meta').textContent=availability(p);
   detail.querySelector('.product-detail [data-whatsapp]').textContent='Consultar peça pelo WhatsApp ↗';
   const back = detail.querySelector('.eyebrow');back.href=`${base}colecao/`;back.textContent='← Voltar à coleção';
   const sizeQuery=new URLSearchParams(location.search).get('tamanho');
   if(p.tamanhos.includes(sizeQuery))document.querySelector('#product-size').value=sizeQuery;
   const gallery = document.createElement('div');gallery.className='product-gallery';
   const mainImage = detail.querySelector('.product-detail > img');
   mainImage.src = `${base}assets/img/${p.imagens[0]}`;
   mainImage.alt = imageAlt(p);
   const colorSelect=document.querySelector('#product-color');
   colorSelect.required=true;
   const selectedColor=colorSelect.value;
   const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Escolha a cor ou estampa';colorSelect.prepend(placeholder);colorSelect.value=selectedColor;
   colorSelect.addEventListener('change',event=>{const image=p.imagensPorCor?.[event.target.value];if(image){mainImage.src=`${base}assets/img/${image}`;mainImage.alt=`${imageAlt(p)}: referência da opção ${event.target.value}`;}});
   mainImage.replaceWith(gallery);gallery.append(mainImage);
   if(p.imagens.length > 1) {
    const thumbnails=document.createElement('div');thumbnails.className='gallery-thumbnails';
    p.imagens.forEach((image,index)=>{
     const choices=Object.entries(p.imagensPorCor || {}).filter(([,file])=>file===image).map(([color])=>color);
     const button=document.createElement('button');button.className='variant-thumbnail';button.type='button';
     const thumb=document.createElement('img');thumb.src=`${base}assets/img/${image}`;thumb.alt='';thumb.width=60;thumb.height=80;thumb.loading='lazy';
     const label=document.createElement('span');label.textContent=choices.join(' / ') || `Imagem ${index+1}`;
     button.setAttribute('aria-label',`Ver ${label.textContent} de ${p.nome}`);button.append(thumb,label);
     button.addEventListener('click',()=>{mainImage.src=`${base}assets/img/${image}`;mainImage.alt=`${p.nome}: ${label.textContent}`;if(choices.length===1)colorSelect.value=choices[0];else if(!choices.includes(colorSelect.value))colorSelect.value='';});thumbnails.append(button);
    });
    gallery.append(thumbnails);
   }
  }
 }
 document.querySelectorAll('[data-related]').forEach(el => {
  const current = allProducts.find(p=>p.slug === el.dataset.related);
  el.innerHTML = products.filter(p=>p.slug !== current.slug).sort((a,b)=>Number(b.categoria===current.categoria)-Number(a.categoria===current.categoria)).slice(0,2).map(card).join('');
 });
 function whatsappURL(p,selection={}) {
  const number = config.WHATSAPP_NUMBER;
  if(!/^\d{10,15}$/.test(number)) return null;
   let message = 'Olá! Gostaria de conhecer a ZAMORE.';
   if(p) message = `Olá! Tenho interesse no ${p.nome} da ZAMORE. Vi o valor de ${money(price(p))} e gostaria de confirmar a disponibilidade.${selection.size ? ` Tamanho: ${selection.size}.` : ''}${selection.color ? ` Cor: ${selection.color}.` : ''} ${productURL(p)}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
 }
 window.Zadoni = {whatsappURL};
 document.addEventListener('click',event => {
  const button = event.target.closest('[data-whatsapp]');if(!button)return;
  const p = allProducts.find(p=>p.slug === button.dataset.whatsapp);
  const isCurrentProduct = p && detail?.dataset.product === p.slug;
  if(isCurrentProduct && !document.querySelector('#product-color').reportValidity())return;
  const url = whatsappURL(p,isCurrentProduct ? {size:document.querySelector('#product-size')?.value,color:document.querySelector('#product-color')?.value} : {});
  if(url) window.open(url,'_blank','noopener,noreferrer');else document.querySelector('#contact-dialog').showModal();
 });
 if(config.SITE_URL && /^https?:\/\//.test(config.SITE_URL)) {
  const url = `${config.SITE_URL.replace(/\/$/,'')}/${document.body.dataset.route}${document.body.dataset.route ? '/' : ''}`;
  const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');canonical.rel='canonical';canonical.href=url;document.head.append(canonical);
  const og = document.querySelector('meta[property="og:url"]') || document.createElement('meta');og.setAttribute('property','og:url');og.content=url;document.head.append(og);
 }
})();
