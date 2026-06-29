document.addEventListener('DOMContentLoaded', () => {

  // ── LOADING SCREEN ──────────────────────────────────────
  const loadScreen = document.getElementById('loadScreen');
  const loadFill   = document.getElementById('loadFill');
  const loadPct    = document.getElementById('loadPct');
  let pct = 0;
  const loadTimer = setInterval(() => {
    pct += Math.random() * 8 + 3;
    if (pct >= 100) { pct = 100; clearInterval(loadTimer); }
    loadFill.style.width = pct + '%';
    loadPct.textContent  = Math.floor(pct) + '%';
    if (pct >= 100) {
      setTimeout(() => {
        loadScreen.classList.add('out');
        setTimeout(() => { loadScreen.style.display='none'; startApp(); }, 650);
      }, 250);
    }
  }, 55);

  function startApp() {
    document.getElementById('mainCard').classList.add('show');
    document.querySelectorAll('.link-btn').forEach((b,i) => setTimeout(()=>b.classList.add('in'),120+i*90));
    if (typeof window.initMusic === 'function') window.initMusic();
    trackVisit();
    loadReactions();
  }

  // ── PARTICLES ───────────────────────────────────────────
  const canvas=document.getElementById('bgCanvas'), ctx=canvas.getContext('2d');
  let W,H,pts=[];
  const mouse={x:-9999,y:-9999}, COLS=['#00fff0','#7b2fff','#ffffff'];
  function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
  function mkP(){return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.4,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.28,a:Math.random()*.55+.08,c:COLS[Math.floor(Math.random()*3)],ts:Math.random()*.016+.004,td:Math.random()>.5?1:-1};}
  function drawLines(){for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);if(d<105){ctx.beginPath();ctx.strokeStyle=`rgba(0,255,240,${.05*(1-d/105)})`;ctx.lineWidth=.4;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}}}
  function loop(){ctx.clearRect(0,0,W,H);drawLines();pts.forEach(p=>{p.a+=p.ts*p.td;if(p.a>.6||p.a<.04)p.td*=-1;const d=Math.hypot(p.x-mouse.x,p.y-mouse.y);if(d<85){p.x+=(p.x-mouse.x)/d*.7;p.y+=(p.y-mouse.y)/d*.7;}p.x+=p.vx;p.y+=p.vy;if(p.x<-8)p.x=W+8;if(p.x>W+8)p.x=-8;if(p.y<-8)p.y=H+8;if(p.y>H+8)p.y=-8;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.globalAlpha=p.a;ctx.fill();ctx.globalAlpha=1;});requestAnimationFrame(loop);}
  resize();for(let i=0;i<65;i++)pts.push(mkP());
  window.addEventListener('resize',resize);
  window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
  loop();

  // ── CARD TILT ───────────────────────────────────────────
  const mc=document.getElementById('mainCard');
  if(mc&&!window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    let fr;
    document.addEventListener('mousemove',e=>{cancelAnimationFrame(fr);fr=requestAnimationFrame(()=>{const r=mc.getBoundingClientRect(),dx=(e.clientX-(r.left+r.width/2))/(r.width/2),dy=(e.clientY-(r.top+r.height/2))/(r.height/2);mc.style.transform=`perspective(900px) rotateX(${dy*-3}deg) rotateY(${dx*3}deg)`;});});
    document.addEventListener('mouseleave',()=>{mc.style.transition='transform .5s ease';mc.style.transform='perspective(900px) rotateX(0) rotateY(0)';});
    mc.addEventListener('mouseenter',()=>mc.style.transition='transform .1s ease');
  }

  // ── SLIDE TO PROFILE (animated from right) ───────────────
  const slidesWrap  = document.getElementById('slidesWrap');
  const avatarBtn   = document.getElementById('avatarWrapper');
  const backBtn     = document.getElementById('backBtn');
  const profileCard = document.getElementById('profileCard');

  function goProfile(){
    slidesWrap.classList.add('show-profile');
    setTimeout(()=>profileCard.classList.add('show'),80);
  }
  function goMain(){
    profileCard.classList.remove('show');
    slidesWrap.classList.remove('show-profile');
  }
  if(avatarBtn) avatarBtn.addEventListener('click', goProfile);
  if(backBtn)   backBtn.addEventListener('click', goMain);

  // ── REACTIONS ───────────────────────────────────────────
  let likes    = parseInt(localStorage.getItem('rw9_likes')||'0');
  let dislikes = parseInt(localStorage.getItem('rw9_dislikes')||'0');
  let userLiked    = localStorage.getItem('rw9_liked')==='1';
  let userDisliked = localStorage.getItem('rw9_disliked')==='1';

  function loadReactions(){
    document.getElementById('likeCount').textContent    = likes;
    document.getElementById('dislikeCount').textContent = dislikes;
    if(userLiked)    document.getElementById('likeBtn').classList.add('active');
    if(userDisliked) document.getElementById('dislikeBtn').classList.add('active');
  }

  function spawnFloat(btn,text,color){
    const el=document.createElement('div');
    el.className='float-num';el.textContent=text;el.style.color=color;
    el.style.cssText+=';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;font-weight:900;font-size:.85rem;z-index:10;';
    btn.style.position='relative';btn.appendChild(el);
    setTimeout(()=>el.remove(),900);
  }

  document.getElementById('likeBtn').addEventListener('click',function(){
    if(userDisliked){dislikes=Math.max(0,dislikes-1);userDisliked=false;document.getElementById('dislikeBtn').classList.remove('active');localStorage.setItem('rw9_disliked','0');}
    if(!userLiked){likes++;userLiked=true;this.classList.add('active','pop');spawnFloat(this,'+1','#00c850');showToast('👍 Danke! Das freut mich!');setTimeout(()=>this.classList.remove('pop'),400);localStorage.setItem('rw9_liked','1');}
    else{likes=Math.max(0,likes-1);userLiked=false;this.classList.remove('active');localStorage.setItem('rw9_liked','0');}
    document.getElementById('likeCount').textContent=likes;
    document.getElementById('dislikeCount').textContent=dislikes;
    localStorage.setItem('rw9_likes',likes);localStorage.setItem('rw9_dislikes',dislikes);
  });

  document.getElementById('dislikeBtn').addEventListener('click',function(){
    if(userLiked){likes=Math.max(0,likes-1);userLiked=false;document.getElementById('likeBtn').classList.remove('active');localStorage.setItem('rw9_liked','0');}
    if(!userDisliked){dislikes++;userDisliked=true;this.classList.add('active','pop');spawnFloat(this,'-1','#ff3c3c');setTimeout(()=>this.classList.remove('pop'),400);localStorage.setItem('rw9_disliked','1');}
    else{dislikes=Math.max(0,dislikes-1);userDisliked=false;this.classList.remove('active');localStorage.setItem('rw9_disliked','0');}
    document.getElementById('likeCount').textContent=likes;
    document.getElementById('dislikeCount').textContent=dislikes;
    localStorage.setItem('rw9_likes',likes);localStorage.setItem('rw9_dislikes',dislikes);
  });

  // ── VISITOR COUNTER + POPUP ─────────────────────────────
  function trackVisit(){
    const v=parseInt(localStorage.getItem('rw9_visits')||'0')+1;
    localStorage.setItem('rw9_visits',v);
    const el=document.getElementById('visitCount');
    if(el) el.textContent=v.toLocaleString('de-DE');
  }

  // Create backdrop
  const backdrop=document.createElement('div');
  backdrop.className='popup-backdrop';
  document.body.appendChild(backdrop);

  const visitCounter=document.getElementById('visitCounter');
  const visitPopup  =document.getElementById('visitPopup');
  const vpClose     =document.getElementById('visitPopupClose');

  function openVisitPopup(){
    document.getElementById('vpVisits').textContent = localStorage.getItem('rw9_visits')||'1';
    document.getElementById('vpLikes').textContent  = localStorage.getItem('rw9_likes')||'0';
    visitPopup.classList.add('open');
    backdrop.classList.add('open');
  }

  function closeVisitPopup(){
    vpClose.classList.add('closing-anim');
    visitPopup.classList.add('closing');
    backdrop.classList.remove('open');
    setTimeout(()=>{
      visitPopup.classList.remove('open','closing');
      vpClose.classList.remove('closing-anim');
    },350);
  }

  if(visitCounter) visitCounter.addEventListener('click', openVisitPopup);
  if(vpClose) vpClose.addEventListener('click', closeVisitPopup);
  backdrop.addEventListener('click', closeVisitPopup);

  // ── TOAST ───────────────────────────────────────────────
  function showToast(msg){
    const t=document.getElementById('toast');
    t.textContent=msg;t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),2400);
  }
  window.showToast=showToast;

  // ── MODAL ───────────────────────────────────────────────
  const overlay=document.getElementById('modalOverlay');
  const openM=()=>{overlay.classList.add('open');};
  const closeM=()=>{overlay.classList.remove('open');};
  document.getElementById('datenschutzBtn').addEventListener('click',openM);
  document.getElementById('modalClose').addEventListener('click',closeM);
  document.getElementById('modalOk').addEventListener('click',closeM);
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeM();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM();});

  // ── SPOTIFY TIP ─────────────────────────────────────────
  const spotifyTip=document.getElementById('spotifyTip');
  if(spotifyTip) spotifyTip.addEventListener('click',()=>{
    window.open('https://open.spotify.com/playlist/0SfXKT65MSbypPLInItqIm','_blank');
  });

  // Also make player-info click go to Spotify
  const playerInfo=document.querySelector('.player-info');
  if(playerInfo) playerInfo.addEventListener('click',()=>{
    window.open('https://open.spotify.com/playlist/0SfXKT65MSbypPLInItqIm','_blank');
  });

  // ── EASTER EGG (Konami Code) ────────────────────────────
  const KONAMI=[38,38,40,40,37,39,37,39,66,65];
  let ki=0;
  document.addEventListener('keydown',e=>{
    if(e.keyCode===KONAMI[ki]){ki++;if(ki===KONAMI.length){triggerEasterEgg();ki=0;}}else ki=0;
  });
  // Also: triple-click on copyright
  let clickCount=0,clickTimer;
  const copy=document.querySelector('.copyright');
  if(copy) copy.addEventListener('click',()=>{
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer=setTimeout(()=>clickCount=0,600);
    if(clickCount>=3){triggerEasterEgg();clickCount=0;}
  });

  function triggerEasterEgg(){
    const ee=document.getElementById('easterEgg');
    if(!ee)return;
    ee.classList.add('show');
    showToast('🥚 Easter Egg gefunden!');
    setTimeout(()=>ee.classList.remove('show'),3500);
  }

});
