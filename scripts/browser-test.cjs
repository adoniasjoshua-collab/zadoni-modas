/* Servidor em 127.0.0.1:4173. Uso: node scripts/browser-test.cjs [playwright] [chrome.exe] */
const {chromium}=require(process.argv[2] || 'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.argv[3]?{executablePath:process.argv[3]}:{})});
 const page=await browser.newPage();const errors=[];const origin='http://127.0.0.1:4173';
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 fs.mkdirSync('test-results',{recursive:true});
 async function images(){await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>{i.loading='eager';return i.decode();})));}
 for(const width of [320,375,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/colecao/','/produto/vestido-midi-aurora/']){
   await page.goto(origin+route);await images();assert.equal(await page.locator('h1').count(),1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width} ${route}`);
   assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,nofollow');
   if(route==='/'){
    assert.equal(await page.locator('#catalog-grid .product-card').count(),4);
    assert.equal(await page.locator('#navigation > a').count(),3);
    assert.equal(await page.locator('.dress-menu,.categories,.size-section,.demo-review').count(),0);
    if(width<768){await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');}
    if([390,1440].includes(width))await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
   }
   if(route==='/colecao/' && [390,1440].includes(width))await page.screenshot({path:`test-results/category-${width}.png`,fullPage:true});
  }
 }
 await page.goto(origin+'/');await page.locator('.hero .button').click();assert.equal(new URL(page.url()).hash,'#colecao');
 await page.selectOption('[name=categoria]','vestidos');assert.equal(await page.locator('#catalog-grid .product-card').count(),3);
 await page.selectOption('[name=tamanho]','P');assert.equal(await page.locator('#catalog-grid .product-card').count(),1);
 await page.locator('[type=reset]').click();await page.waitForTimeout(50);assert.equal(await page.locator('#catalog-grid .product-card').count(),4);
 await page.fill('.search input','essencia');await page.locator('.search button').click();await page.waitForURL('**/colecao/?q=essencia');assert.equal(await page.locator('#catalog-grid .product-card').count(),1);
 await page.locator('[type=reset]').click();await page.waitForTimeout(50);assert.equal(await page.locator('#catalog-grid .product-card').count(),4);assert.equal(await page.locator('h1').innerText(),'Nossa coleção');
 await page.goto(origin+'/colecao/?q=brisa');assert.equal(await page.locator('#catalog-grid .product-card').count(),0);assert(await page.locator('.empty').isVisible());
 await page.goto(origin+'/colecao/?tamanho=P');assert.equal(await page.locator('#catalog-grid .product-card').count(),2);
 await page.locator('.card-detail').first().click();assert(page.url().includes('/produto/'));assert.equal(await page.locator('[data-related] .product-card').count(),2);
 await page.selectOption('#product-size','G');await page.locator('.product-detail [data-whatsapp]').click();assert(await page.locator('dialog').isVisible());await page.locator('dialog button').click();assert(!await page.locator('dialog').isVisible());
 await page.goto(origin+'/produto/vestido-longo-serena/');await page.selectOption('#product-size','GG');await page.selectOption('#product-color','Preto');assert((await page.locator('.product-gallery img').getAttribute('src')).endsWith('serena-preto.jpg'));
 // Captura a URL sem abrir o WhatsApp e sem enviar mensagens.
 await page.evaluate(()=>{window.ZADONI_CONFIG.WHATSAPP_NUMBER='5500000000000';window.open=url=>{window.testWhatsAppURL=url;};});
 await page.locator('.product-detail [data-whatsapp]').click();const message=decodeURIComponent(await page.evaluate(()=>window.testWhatsAppURL));
 assert(message.includes('Vestido Longo Serena'));assert(message.includes('289,90'));assert(message.includes('Tamanho: GG'));assert(message.includes('Cor: Preto'));assert(message.includes('/produto/vestido-longo-serena/'));
 await page.locator('.product-detail .eyebrow').click();assert.equal(new URL(page.url()).pathname,'/colecao/');
 await page.route('**/preview/**',async route=>{const response=await route.fetch({url:route.request().url().replace('/preview/','/')});await route.fulfill({response});});
 await page.goto(origin+'/preview/');await page.locator('#navigation a').first().click();assert(page.url().includes('/preview/colecao/'));
 await page.locator('.card-detail').first().click();assert(page.url().includes('/preview/produto/'));
 function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&!['node_modules','.git','test-results'].includes(e.name)?walk(path.join(dir,e.name)):e.isFile()&&e.name==='index.html'?[path.join(dir,e.name)]:[]);}
 await page.setViewportSize({width:390,height:844});
 for(const file of walk('.')){await page.goto(origin+'/'+file.replaceAll('\\','/').replace(/index\.html$/,''));assert.equal(await page.locator('h1').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file);}
 await page.goto(origin+'/404.html');assert.equal(await page.locator('h1').count(),1);assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: seleção inicial, menu de 3 links, filtros, busca, peças fora da seleção, detalhes, galeria, WhatsApp, subdiretório, 6 larguras e todas as páginas sem erros de console.');
})().catch(e=>{console.error(e);process.exit(1);});
