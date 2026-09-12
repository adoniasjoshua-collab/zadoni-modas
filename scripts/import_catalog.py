"""Importa o inventário visual revisado. Não altera as fotos originais.

Cada arquivo de origem pertence a exatamente um modelo. Cores/estampas são
variantes, não novos produtos. A identificação visual não substitui o SKU real.
"""
from pathlib import Path
import json
import shutil
import subprocess

ROOT=Path(__file__).resolve().parent.parent
SOURCE=ROOT/'assets/FOTOS CATALO ZADONI MODA'
MANIFEST=ROOT/'assets/data/catalogo-modelos.json'

def import_catalog():
    groups=json.loads(MANIFEST.read_text(encoding='utf-8'))
    sources=[photo['arquivo'] for model in groups for photo in model['fotos']]
    available={p.name for p in SOURCE.iterdir() if p.suffix.lower() in {'.jpg','.jpeg','.png','.webp'}}
    assert len(sources)==len(set(sources)), 'Foto repetida entre modelos.'
    assert set(sources)==available, f'Fotos sem associação ou ausentes: {available.symmetric_difference(sources)}'
    assert len({m['slug'] for m in groups})==len(groups), 'Modelo repetido.'
    old=json.loads(subprocess.check_output(['node','-e',"global.window={};require('./assets/data/produtos.js');process.stdout.write(JSON.stringify(window.ZADONI_PRODUCTS))"],cwd=ROOT,text=True,encoding='utf-8'))
    previous={p['slug']:p for p in old}
    products=[]
    for model in groups:
        slug=model['slug']
        images=[];by_color={}
        for number,photo in enumerate(model['fotos'],1):
            relative=f'catalogo/{slug}/{number:02d}.jpg'
            target=ROOT/'assets/img'/relative
            target.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(SOURCE/photo['arquivo'],target)
            images.append(relative)
            for color in photo['cores']:
                assert color not in by_color, (slug,color)
                by_color[color]=relative
        prior=previous.get(slug,{})
        product={
            'id':model['id'],'nome':model['nome'],'slug':slug,'categoria':model['categoria'],
            'preco':prior.get('preco'),'promocional':prior.get('promocional'),
            'cores':list(by_color),'tamanhos':prior.get('tamanhos',['P','M','G','GG']),
            'tecido':'Composição a confirmar','modelagem':model['modelagem'],
            'disponivel':prior.get('disponivel'),'destaque':True,'tags':model['tags'],
            'descricao':model['descricao'],'imagem':images[0],'imagens':images,
            'imagensPorCor':by_color,'fotoFornecida':True,
            'modeloUnico':slug,'identificacao':'Agrupamento visual; SKU comercial a confirmar',
        }
        products.append(product)
    (ROOT/'assets/data/produtos.js').write_text('/* Modelos agrupados por corte. Fotos fornecidas; nomes e tamanhos DEMO. Valores não informados ficam nulos. */\nwindow.ZADONI_PRODUCTS = '+json.dumps(products,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
    print(f'{len(groups)} modelos, {len(sources)} fotos associadas uma vez, originais preservados.')

if __name__=='__main__':
    import_catalog()
