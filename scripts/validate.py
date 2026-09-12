"""Verificações estáticas: executar após build.py."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
ROOT=Path(__file__).resolve().parent.parent
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.h1=0;self.robots=False;self.links=[];self.title='';self.in_title=False;self.ids=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if tag=='title':self.in_title=True
  if a.get('id'):self.ids.append(a['id'])
  if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content')=='noindex,nofollow'
  if tag=='img':assert all(k in a for k in ['alt','width','height']),a
  for attr in ['href','src','action']:
   if a.get(attr):self.links.append(a[attr])
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
 def handle_data(self,data):
  if self.in_title:self.title+=data
titles=set();count=0
for path in ROOT.rglob('*.html'):
 p=Page();p.feed(path.read_text(encoding='utf-8'));assert p.robots,path
 assert p.h1==1,(path,p.h1)
 assert len(p.ids)==len(set(p.ids)),('IDs repetidos',path)
 if path.name!='404.html':assert p.title not in titles,('title repetido',path)
 titles.add(p.title)
 for link in p.links:
  u=urlsplit(link)
  if u.scheme or u.netloc or not u.path:continue
  target=(ROOT / unquote(u.path).lstrip('/') if u.path.startswith('/') else path.parent/unquote(u.path)).resolve()
  assert target.is_relative_to(ROOT),('fora do projeto',path,link)
  if target.is_dir():target=target/'index.html'
  assert target.is_file(),('link quebrado',path,link)
 count+=1
assert (ROOT/'robots.txt').read_text().strip()=='User-agent: *\nDisallow: /'
assert not list(ROOT.glob('*sitemap*'))
size=sum(p.stat().st_size for folder in ['css','js','data','img','icons'] for p in (ROOT/'assets'/folder).rglob('*') if p.is_file())
print(f'PASS: {count} paginas, links locais, H1, titles, robots, imagens e IDs. Assets totais: {size:,} bytes.')
