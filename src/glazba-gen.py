import numpy as np, subprocess, sys
from scipy.signal import lfilter, fftconvolve
SR=32000
def env(n,a,d,s=0.0,curve=1.0):
    t=np.arange(n)/SR;e=np.minimum(1,t/max(a,1e-4))*np.exp(-np.maximum(0,t-a)/max(d,1e-4))
    return e
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR);return lfilter([1-a],[1,-a],x)
def hp(x,fc):return x-lp(x,fc)
def nf(m):return 440*2**((m-69)/12)
def inst(name,m,dur,vel=1.0):
    f=nf(m);n=int((dur+ {'bell':1.6,'piano':1.4,'marimba':.6,'bass':.3,'pad':.8,'brass':.3,'flute':.25,'pluck':.5}[name])*SR);t=np.arange(n)/SR
    if name=='bell':
        y=np.sin(2*np.pi*f*t)*env(n,.002,.9)+.35*np.sin(2*np.pi*f*2*t)*env(n,.002,.35)+.18*np.sin(2*np.pi*f*3.01*t)*env(n,.001,.18)+.08*np.sin(2*np.pi*f*4.2*t)*env(n,.001,.08)
    elif name=='piano':
        tr=1+.04*np.sin(2*np.pi*5*t)
        y=(np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*2*f*t)*np.exp(-t*3)+.15*np.sin(2*np.pi*3*f*t)*np.exp(-t*6))*env(n,.004,.75)*tr
        y*=np.where(t>dur,np.exp(-(t-dur)*7),1)
    elif name=='marimba':
        y=(np.sin(2*np.pi*f*t)*env(n,.002,.28)+.3*np.sin(2*np.pi*f*3.93*t)*env(n,.001,.05))
    elif name=='pluck':
        y=sum(np.sin(2*np.pi*f*k*t)/k*np.exp(-t*(3+k*2.5)) for k in range(1,7))*env(n,.002,2)
    elif name=='bass':
        y=(np.sin(2*np.pi*f*t)+.25*np.sin(2*np.pi*2*f*t)+.1*np.sin(2*np.pi*3*f*t))*env(n,.006,.5)
        y*=np.where(t>dur*.9,np.exp(-(t-dur*.9)*14),1)
    elif name=='pad':
        y=0
        for dt_ in(-.12,0,.12):
            ph=(f*2**(dt_/12)*t)%1;y=y+(2*ph-1)
        y=lp(lp(y,f*3),f*4)/3;a=np.minimum(1,t/.35);r=np.where(t>dur,np.exp(-(t-dur)*4),1);y=y*a*r
    elif name=='brass':
        ph=(f*t)%1;y=2*ph-1;fe=f*(2+5*np.exp(-t*6))
        y=lp(y,1800);y=lp(y,1400);y*=np.minimum(1,t/.03)*np.where(t>dur,np.exp(-(t-dur)*12),1)
    elif name=='flute':
        vib=np.sin(2*np.pi*5.5*t)*np.minimum(1,t/.3)*.006
        y=(np.sin(2*np.pi*f*t*(1+vib))+.2*np.sin(4*np.pi*f*t))*np.minimum(1,t/.05)*np.where(t>dur,np.exp(-(t-dur)*14),1)
        y+=np.random.RandomState(m).randn(n)*.02*np.minimum(1,t/.05)
    return y*vel
def drum(kind,n0,buf,vel=1):
    rs=np.random.RandomState(n0%9973)
    if kind=='k':n=int(.25*SR);t=np.arange(n)/SR;y=np.sin(2*np.pi*(50*t+90*(1-np.exp(-t*30))/30))*np.exp(-t*12)*1.0
    elif kind=='s':n=int(.2*SR);t=np.arange(n)/SR;y=hp(rs.randn(n),1500)*np.exp(-t*22)*.45+np.sin(2*np.pi*190*t)*np.exp(-t*30)*.35
    elif kind=='h':n=int(.06*SR);t=np.arange(n)/SR;y=hp(rs.randn(n),6000)*np.exp(-t*70)*.22
    elif kind=='sh':n=int(.09*SR);t=np.arange(n)/SR;y=hp(rs.randn(n),4000)*np.minimum(1,t/.02)*np.exp(-t*40)*.16
    elif kind=='bg':n=int(.25*SR);t=np.arange(n)/SR;y=np.sin(2*np.pi*(220*t+60*(1-np.exp(-t*20))/20))*np.exp(-t*14)*.45
    elif kind=='bg2':n=int(.25*SR);t=np.arange(n)/SR;y=np.sin(2*np.pi*(330*t+60*(1-np.exp(-t*20))/20))*np.exp(-t*16)*.4
    elif kind=='tri':n=int(.8*SR);t=np.arange(n)/SR;y=(np.sin(2*np.pi*2600*t)+.5*np.sin(2*np.pi*3900*t))*np.exp(-t*5)*.08
    add(buf,n0,y*vel)
def add(buf,n0,y):
    n1=min(len(buf),n0+len(y));buf[n0:n1]+=y[:n1-n0]
# ---- composition
MAJ=[0,2,4,5,7,9,11]
def chord_tones(root,q):return [root,root+(3 if q=='m' else 4),root+7]
def compose(cfg):
    rs=np.random.RandomState(cfg['seed']);bpm=cfg['bpm'];beat=60/bpm;bar=beat*4;key=cfg['key']
    prog=cfg['prog'] # list of (degree semis, quality) per bar, 8 bars; song = A A B A (32 bars)
    bars=len(prog)*4;Ltot=bars*bar;N=int(Ltot*SR)
    tracks={k:np.zeros(N+SR*4) for k in['mel','harm','bass','dr','pad']}
    # melody motif rhythms (in 8ths) per 2 bars
    rhythms=[[2,1,1,2,2, 2,2,4],[1,1,2,1,1,2, 3,1,4],[2,2,1,1,2, 1,1,1,1,4],[3,1,2,2, 2,1,1,4]]
    scale=[key+s for s in MAJ]
    def nearest(target,pool):return min(pool,key=lambda p:abs(p-target))
    def scale_notes(lo,hi):return [p for p in range(lo,hi) if (p-key)%12 in MAJ]
    def make_phrase(chs,seed,end_tonic):
        r=np.random.RandomState(seed);notes=[];cur=key+12+cfg.get('oct',0)*12+[0,4,7][r.randint(3)]
        pool=scale_notes(key+7+cfg.get('oct',0)*12,key+28+cfg.get('oct',0)*12)
        for b2 in range(0,len(chs),2):
            rh=rhythms[r.randint(len(rhythms))];pos=0
            for i,d in enumerate(rh):
                ch=chs[b2+(1 if pos>=8 else 0)];ct=[(x)%12 for x in chord_tones(key+ch[0],ch[1])]
                strong=(pos%4==0)
                if strong:cands=[p for p in pool if p%12 in ct]
                else:cands=[p for p in pool if abs(p-cur)<=4]
                cands=sorted(cands,key=lambda p:abs(p-cur)+r.rand()*3)
                cur=cands[0] if r.rand()<.7 else cands[min(1,len(cands)-1)]
                if i==len(rh)-1 and b2+2>=len(chs) and end_tonic:cur=nearest(cur,[p for p in pool if p%12==key%12])
                notes.append((b2*8+pos,d,cur));pos+=d
        return notes
    A=prog[:4] if len(prog)>=4 else prog
    secA=prog[:8];secB=cfg['progB']
    pA=make_phrase(secA,cfg['seed']*3+1,True);pA2=make_phrase(secA,cfg['seed']*3+1,True)
    pB=make_phrase(secB,cfg['seed']*3+2,False)
    form=[(secA,pA,0),(secA,pA,1),(secB,pB,0),(secA,pA,2)]
    e8=beat/2
    for si,(chs,phr,var) in enumerate(form):
        off=si*8*bar
        for (p8,d8,m) in phr:
            t0=off+p8*e8;mm=m+(12 if (var==1 and cfg.get('octvar')) else 0)
            if var==2 and p8>=56:pass
            y=inst(cfg['lead'],mm,d8*e8*.95,.42 if cfg['lead']!='brass' else .3);add(tracks['mel'],int(t0*SR),y)
            if cfg.get('lead2') and var>=1:add(tracks['mel'],int((t0+0.0)*SR),inst(cfg['lead2'],mm+12,d8*e8*.9,.12))
        for bi,(deg,q) in enumerate(chs):
            t0=off+bi*bar;ct=chord_tones(key+deg-12,q)
            # bass
            pat=cfg['bassp']
            for (b8,iv,ln) in pat:
                add(tracks['bass'],int((t0+b8*e8)*SR),inst('bass',key+deg-24+iv,ln*e8,.55))
            # harmony
            if cfg['harm']=='arp':
                arp=[ct[0],ct[1],ct[2],ct[1]+12-12,ct[2],ct[1],ct[0]+12,ct[2]]
                for k in range(8):add(tracks['harm'],int((t0+k*e8)*SR),inst(cfg['harmi'],arp[k]+12,e8*.9,.16))
            elif cfg['harm']=='stab':
                for k in [1,3,5,7]:
                    for x in ct:add(tracks['harm'],int((t0+k*e8)*SR),inst(cfg['harmi'],x+12,e8*.7,.09))
            elif cfg['harm']=='block':
                for k in [0,4]:
                    for x in ct:add(tracks['harm'],int((t0+k*e8)*SR),inst(cfg['harmi'],x+12,e8*3.6,.08))
            for x in ct:add(tracks['pad'],int(t0*SR),inst('pad',x+12,bar*.98,.05*cfg.get('padv',1)))
            # drums
            for k in range(8):
                n0=int((t0+k*e8)*SR)
                for kind in cfg['drums'][k]:drum(kind,n0+bi*7+k,tracks['dr'])
    # mix
    mix=tracks['mel']*1.0+tracks['harm']*1.0+tracks['bass']*.9+tracks['dr']*cfg.get('drv',.8)+tracks['pad']*1.0
    # reverb
    rs2=np.random.RandomState(5);irn=int(1.6*SR);ir=rs2.randn(irn)*np.exp(-np.arange(irn)/SR*3.2);ir=lp(ir,4000);ir/=np.sqrt((ir**2).sum())
    wet=fftconvolve(tracks['mel']+tracks['harm']*.8+tracks['pad'],ir)[:len(mix)]*.28
    mix=mix+wet
    # wrap tail into start for seamless loop
    loop=mix[:N].copy();tail=mix[N:];loop[:len(tail)]+=tail[:N]
    loop/=np.max(np.abs(loop))*1.12
    # soft limiter
    loop=np.tanh(loop*1.3)/np.tanh(1.3)*.9
    return loop,Ltot
CFG=[
 dict(name='m0',seed=11,bpm=104,key=60,prog=[(0,''),(7,''),(9,'m'),(5,''),(0,''),(7,''),(5,''),(7,'')],progB=[(5,''),(0,''),(5,''),(7,''),(9,'m'),(4,'m'),(5,''),(7,'')],lead='bell',harm='arp',harmi='piano',bassp=[(0,0,3),(4,7,3)],drums=[['k','h'],['h'],['h'],['h'],['k','s','h'],['h'],['h'],['h','sh']],drv=.5),
 dict(name='m1',seed=21,bpm=118,key=62,prog=[(0,''),(5,''),(7,''),(0,''),(9,'m'),(5,''),(7,''),(7,'')],progB=[(5,''),(7,''),(4,'m'),(9,'m'),(5,''),(7,''),(5,''),(7,'')],lead='piano',lead2='bell',octvar=1,harm='stab',harmi='pluck',bassp=[(0,0,2),(3,0,1),(4,7,2),(6,7,2)],drums=[['k','h'],['h'],['s','h'],['h'],['k','h'],['k','h'],['s','h'],['h']],drv=.75),
 dict(name='m2',seed=31,bpm=112,key=57,prog=[(3,''),(10,''),(0,'m'),(7,'m'),(8,''),(3,''),(5,'m'),(7,'')],progB=[(8,''),(10,''),(3,''),(0,'m'),(8,''),(10,''),(5,'m'),(7,'')],lead='marimba',lead2='flute',harm='arp',harmi='pluck',bassp=[(0,0,2),(3,0,1),(4,0,2),(6,7,2)],drums=[['k','sh'],['sh'],['bg','sh'],['sh'],['k','sh'],['bg2'],['bg','sh'],['sh']],drv=.8),
 dict(name='m3',seed=41,bpm=84,key=65,prog=[(0,''),(9,'m'),(5,''),(7,''),(0,''),(4,'m'),(5,''),(7,'')],progB=[(5,''),(4,'m'),(2,'m'),(7,''),(5,''),(0,''),(2,'m'),(7,'')],lead='bell',harm='block',harmi='piano',bassp=[(0,0,4),(4,7,4)],drums=[['tri'],[],[],[],['sh'],[],[],[]],drv=.6,padv=1.6),
 dict(name='m4',seed=51,bpm=100,key=62,prog=[(0,'m'),(10,''),(3,''),(5,''),(0,'m'),(10,''),(8,''),(7,'')],progB=[(8,''),(3,''),(10,''),(5,''),(8,''),(10,''),(0,'m'),(7,'')],lead='flute',lead2='bell',harm='arp',harmi='bell',bassp=[(0,0,3),(4,7,3)],drums=[['k','sh'],['sh'],['sh'],['sh'],['s','sh'],['sh'],['sh'],['sh']],drv=.5,padv=1.4),
 dict(name='m5',seed=61,bpm=124,key=64,prog=[(0,''),(5,''),(0,''),(7,''),(0,''),(5,''),(7,''),(0,'')],progB=[(5,''),(0,''),(9,'m'),(7,''),(5,''),(0,''),(2,'m'),(7,'')],lead='marimba',lead2='marimba',harm='stab',harmi='marimba',bassp=[(0,0,1),(2,7,1),(3,0,1),(4,0,1),(6,7,2)],drums=[['k','sh'],['bg2','sh'],['bg','sh'],['sh'],['k','sh'],['bg','sh'],['bg2','sh'],['bg','sh']],drv=.8),
 dict(name='m6',seed=71,bpm=112,key=60,prog=[(0,''),(5,''),(7,''),(0,''),(5,''),(0,''),(2,'m'),(7,'')],progB=[(9,'m'),(5,''),(0,''),(7,''),(9,'m'),(5,''),(2,'m'),(7,'')],lead='brass',lead2='bell',harm='block',harmi='piano',bassp=[(0,0,2),(2,0,2),(4,7,2),(6,7,2)],drums=[['k','h'],['h'],['s','h'],['h'],['k','h'],['k','h'],['s','h'],['s']],drv=.85),
]
out=sys.argv[1]
import json;meta={}
for cfg in CFG:
    y,L=compose(cfg)
    ext=np.concatenate([y,y[:int(2.5*SR)]])
    st=np.stack([ext,np.roll(ext,int(.012*SR))*.96],1)
    pcm=(st*32767).astype('<i2').tobytes()
    p=subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ar',str(SR),'-ac','2','-i','-','-c:a','libmp3lame','-b:a','96k','-ar','32000',f'{out}/{cfg["name"]}.mp3'],input=pcm)
    meta[cfg['name']]=round(L,5);print(cfg['name'],round(L,1),'s')
json.dump(meta,open(f'{out}/music.json','w'))
