import json,numpy as np
from PIL import Image
R='/tmp/claude-0/assets/';O='/home/claude/dt/a/'
K=0.75  # 1080 -> 810
P1=R+'para/platformer_background_%d/Layers/';F=R+'fairy/_PNG/%d/'
W=[ # (id, sky, [(file,par,yp)], ground, composite)
 ('w1',P1%1+'layer06_sky.png',[(P1%1+'layer05_rocks.png',.08),(P1%1+'layer04_clouds.png',.03),(P1%1+'layer03_trees.png',.25),(P1%1+'layer02_cake.png',.42)],P1%1+'layer01_ground.png',R+'para/platformer_background_1/platformer_background_1.png'),
 ('w2',F%4+'7.png',[(F%4+'6.png',.06),(F%4+'5.png',.12),(F%4+'4.png',.2),(F%4+'3.png',.33),(F%4+'2.png',.55)],F%4+'1.png',F%4+'background.png'),
 ('w3',P1%3+'layer07_Sky.png',[(P1%3+'layer06_Rocks.png',.06),(P1%3+'layer05_Clouds.png',.03),(P1%3+'layer04_Hills_2.png',.16),(P1%3+'layer03_Hills_1.png',.3),(P1%3+'layer02_Trees.png',.5)],P1%3+'layer01_Ground.png',R+'para/platformer_background_3/platformer_background_3.png'),
 ('w4',P1%2+'layer09_Sky.png',[(P1%2+'layer08_Stars_1.png',.02),(P1%2+'layer07_Stars_2.png',.04),(P1%2+'layer06_Stars_3.png',.06),(P1%2+'layer05_Castle.png',.09),(P1%2+'layer04_Path.png',.2),(P1%2+'layer03_Clouds_3.png',.3),(P1%2+'layer02_Clouds_2.png',.45)],P1%2+'layer01_Clouds_1.png',R+'para/platformer_background_2/platformer_background_2.png'),
 ('w5',F%2+'7.png',[(F%2+'6.png',.06),(F%2+'5.png',.12),(F%2+'4.png',.2),(F%2+'3.png',.33),(F%2+'2.png',.55)],F%2+'1.png',F%2+'background.png'),
 ('w6',F%1+'7.png',[(F%1+'6.png',.03),(F%1+'5.png',.08),(F%1+'4.png',.16),(F%1+'3.png',.3),(F%1+'2.png',.5)],F%1+'1.png',F%1+'background.png'),
 ('w7',P1%4+'layer07_Sky.png',[(P1%4+'layer06_Rocks.png',.06),(P1%4+'layer05_Hills.png',.14),(P1%4+'layer04_Clouds.png',.03),(P1%4+'layer03_Hills_Castle.png',.26),(P1%4+'layer02_Trees_rocks.png',.45)],P1%4+'layer01_Ground.png',R+'para/platformer_background_4/platformer_background_4.png'),
]
meta={}
tot=0
def save(im,name,q=82):
    global tot
    im.save(O+name,'WEBP',quality=q,method=6);import os;tot+=os.path.getsize(O+name)
def seam(im):
    a=np.asarray(im).astype(int);return float(np.abs(a[:,0,:]-a[:,-1,:])[:,:3].mean())
for wid,sky,lays,gr,comp in W:
    m={'layers':[]}
    s=Image.open(sky).convert('RGB').resize((1440,810),Image.LANCZOS);save(s,wid+'_sky.webp',80);m['sky']=wid+'_sky.webp'
    for i,(f,par) in enumerate(lays):
        im=Image.open(f).convert('RGBA');x0,y0,x1,y1=im.getbbox();full=(x0<40 and x1>1880)
        c=im.crop((0,y0,1920,y1));sm=seam(c)>5
        c=c.resize((1440,max(1,round((y1-y0)*K))),Image.LANCZOS);n=f'{wid}_l{i}.webp';save(c,n)
        m['layers'].append({'src':n,'y':y0/1080,'h':(y1-y0)/1080,'par':par,'mir':sm,'top0':y0<5})
    im=Image.open(gr).convert('RGBA');x0,y0,x1,y1=im.getbbox();c=im.crop((0,y0,1920,y1));a=np.asarray(c)
    cov=(a[:,:,3]>128).mean(axis=1);surf=int(np.argmax(cov>.6))
    # walk surface: first row with >60% opaque; but frosting drips etc. fine
    bot=a[-12:,:,:];op=bot[:,:,3]>200;col=bot[:,:,:3][op].mean(axis=0) if op.any() else np.array([120,90,70])
    # darker underside colour from lower middle
    mid=a[int(a.shape[0]*.6):,:,:];op2=mid[:,:,3]>200;col2=mid[:,:,:3][op2].mean(axis=0)
    sm=seam(c)>5
    c=c.resize((1440,round((y1-y0)*K)),Image.LANCZOS);save(c,wid+'_g.webp',85)
    m['ground']={'src':wid+'_g.webp','h':(y1-y0)/1080,'surf':surf/1080,'fill':'#%02x%02x%02x'%tuple(int(v) for v in col),'dark':'#%02x%02x%02x'%tuple(int(v*.8) for v in col2),'mir':sm}
    ci=Image.open(comp).convert('RGB').resize((960,540),Image.LANCZOS);save(ci,wid+'_map.webp',78)
    a=np.asarray(ci).astype(float);l=(a*[.3,.59,.11]).sum(axis=2,keepdims=True);gry=l*.72+np.array([62,64,74]);save(Image.fromarray(gry.clip(0,255).astype('uint8')),wid+'_mapg.webp',78)
    m['map']=wid+'_map.webp';m['mapg']=wid+'_mapg.webp'
    meta[wid]=m
json.dump(meta,open(O+'meta.json','w'),indent=0)
print('total KB',tot//1024);print(json.dumps({k:v['ground'] for k,v in meta.items()}))
