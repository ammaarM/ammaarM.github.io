const docEl=document.documentElement;
const body=document.body;
const reduceMotionMedia=window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion=reduceMotionMedia.matches;
const systemTheme=window.matchMedia('(prefers-color-scheme: dark)');
const THEME_KEY='theme-preference';
const SCROLL_DURATION=prefersReducedMotion?0:680;
const anchorTimers=new WeakMap();
let themeButton;
let navToggle;
let nav;
let navLinks=[];
let sections=[];
let scrollLinks=[];
let projectsGrid;
let projectTemplate;
let yearTarget;
let avatarImg;
let revealGroups=[];
let revealObserver=null;
let refreshGradientTiles=()=>{};
const cubicBezier=(p1x,p1y,p2x,p2y)=>{
  const cx=3*p1x,bx=3*(p2x-p1x)-cx,ax=1-cx-bx;
  const cy=3*p1y,by=3*(p2y-p1y)-cy,ay=1-cy-by;
  const sampleX=t=>((ax*t+bx)*t+cx)*t;
  const sampleY=t=>((ay*t+by)*t+cy)*t;
  const sampleDeriv=t=>(3*ax*t+2*bx)*t+cx;
  const solveX=x=>{
    let t=x;
    for(let i=0;i<5;i+=1){const x2=sampleX(t)-x;const d=sampleDeriv(t);if(Math.abs(x2)<1e-5||d===0)return t;t-=x2/d;}
    let t0=0,t1=1;t=x;
    while(t0<t1){const x2=sampleX(t);if(Math.abs(x2-x)<1e-5)return t;x>x2?t0=t:t1=t;t=(t1+t0)/2;}
    return t;
  };
  return x=>sampleY(solveX(x));
};
const easeEnter=cubicBezier(0.22,1,0.36,1);
const setStoredTheme=mode=>{try{localStorage.setItem(THEME_KEY,mode);}catch(error){}};
const getStoredTheme=()=>{try{return localStorage.getItem(THEME_KEY);}catch(error){return null;}};
const resolveTheme=stored=>stored|| (systemTheme.matches?'dark':'light');
const applyTheme=mode=>{
  const theme=mode==='dark'?'dark':'light';
  docEl.dataset.theme=theme;
  refreshGradientTiles();
  if(themeButton){const isDark=theme==='dark';themeButton.setAttribute('aria-pressed',String(isDark));const label=isDark?'Activate light theme':'Activate dark theme';themeButton.setAttribute('aria-label',label);themeButton.setAttribute('title',label);}
};
const initTheme=()=>{
  const stored=getStoredTheme();
  applyTheme(resolveTheme(stored));
  if(themeButton){themeButton.addEventListener('click',()=>{const current=docEl.dataset.theme==='dark'?'dark':'light';const next=current==='dark'?'light':'dark';setStoredTheme(next);applyTheme(next);});}
  const systemHandler=event=>{if(!getStoredTheme())applyTheme(event.matches?'dark':'light');};
  if(systemTheme.addEventListener){systemTheme.addEventListener('change',systemHandler);}else if(systemTheme.addListener){systemTheme.addListener(systemHandler);}
};
const focusSection=target=>{if(typeof target.focus!=='function')return;requestAnimationFrame(()=>{try{target.focus({preventScroll:true});}catch(error){target.focus();}});};
const highlightSection=target=>{if(!target)return;target.classList.add('is-anchor-target');const timer=anchorTimers.get(target);if(timer)window.clearTimeout(timer);anchorTimers.set(target,window.setTimeout(()=>{target.classList.remove('is-anchor-target');anchorTimers.delete(target);},1400));};
const headerHeight=()=>{const header=document.querySelector('.site-header');return header?header.offsetHeight+8:72;};
const smoothScrollTo=target=>{
  const rect=target.getBoundingClientRect();
  const destination=Math.max(0,rect.top+window.scrollY-headerHeight());
  if(SCROLL_DURATION===0){window.scrollTo({top:destination,behavior:'auto'});return;} 
  const startY=window.scrollY;
  const overshoot=destination>startY?12:-12;
  const scrollEnd=destination+overshoot;
  const start=performance.now();
  const step=now=>{
    const elapsed=now-start;
    const progress=Math.min(1,elapsed/SCROLL_DURATION);
    const eased=easeEnter(progress);
    const current=startY+(scrollEnd-startY)*eased;
    window.scrollTo(0,current);
    if(progress<1){requestAnimationFrame(step);}else{window.setTimeout(()=>window.scrollTo({top:destination,behavior:'auto'}),20);} 
  };
  requestAnimationFrame(step);
};
const handleAnchorScroll=(event,target)=>{
  if(!target)return;
  event.preventDefault();
  smoothScrollTo(target);
  focusSection(target);
  const delay=prefersReducedMotion?0:SCROLL_DURATION+160;
  window.setTimeout(()=>highlightSection(target),delay);
  if(typeof history.pushState==='function'){history.pushState(null,'',`#${target.id}`);}else{window.location.hash=`#${target.id}`;}
};
const fallbackProjects=[{name:'azure-labs-toolkit',description:'Infrastructure blueprints and scripts for Azure learning environments.',html_url:'https://github.com/ammaarM/azure-labs-toolkit',homepage:'',stargazers_count:12,topics:['azure','terraform','iac'],pushed_at:'2024-01-12T00:00:00Z'},{name:'k8s-deployment-templates',description:'Opinionated Kubernetes deployment templates for rapid app delivery.',html_url:'https://github.com/ammaarM/k8s-deployment-templates',homepage:'',stargazers_count:8,topics:['kubernetes','helm','devops'],pushed_at:'2023-11-02T00:00:00Z'},{name:'platform-observability-kit',description:'Dashboards and alerts that surface platform health signals.',html_url:'https://github.com/ammaarM/platform-observability-kit',homepage:'',stargazers_count:5,topics:['observability','dashboards'],pushed_at:'2023-09-18T00:00:00Z'}];
const projectSorter=(a,b)=>{
  if(b.stargazers_count!==a.stargazers_count){return b.stargazers_count-a.stargazers_count;}
  const aTime=new Date(a.pushed_at||a.updated_at||0).getTime();
  const bTime=new Date(b.pushed_at||b.updated_at||0).getTime();
  return bTime-aTime;
};
const initialsFor=name=>name.split(/[-_\s]+/).filter(Boolean).map(chunk=>chunk.charAt(0).toUpperCase()).slice(0,3).join('')||'PR';
const gradientDataUri=name=>{
  const initials=initialsFor(name);
  const dark=docEl.dataset.theme==='dark';
  const start=dark?'#1f355a':'#2f6df6';
  const end=dark?'#3b6edc':'#68a0ff';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-labelledby="title"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${start}"/><stop offset="100%" stop-color="${end}"/></linearGradient></defs><rect width="1280" height="720" rx="56" fill="url(#g)"/><text id="title" x="50%" y="52%" text-anchor="middle" font-family="'Inter','Segoe UI',sans-serif" font-size="260" fill="rgba(255,255,255,0.9)" letter-spacing="18">${initials}</text></svg>`;
  return`data:image/svg+xml,${encodeURIComponent(svg)}`;
};
refreshGradientTiles=()=>{document.querySelectorAll('img[data-gradient="true"]').forEach(img=>{const name=img.dataset.gradientName||'Project';img.src=gradientDataUri(name);});};
const setFallbackContent=(media,type,project)=>{
  const img=media.querySelector('.project-preview');
  const fallback=media.querySelector('.project-fallback');
  const shimmer=media.querySelector('.project-shimmer');
  if(img){img.removeAttribute('src');img.hidden=true;}
  if(fallback){fallback.hidden=false;fallback.replaceChildren();
    if(type==='homepage'&&project.homepage){const link=document.createElement('a');link.className='project-home-link';link.href=project.homepage;link.target='_blank';link.rel='noreferrer';link.textContent='Visit live site';fallback.append(link);}else{const tile=document.createElement('img');tile.src=gradientDataUri(project.name);tile.alt=`Stylized initials for ${project.name}`;tile.loading='lazy';tile.decoding='async';tile.width=640;tile.height=360;tile.dataset.gradient='true';tile.dataset.gradientName=project.name||'Project';fallback.append(tile);}}
  media.classList.add('ready');
  if(shimmer)shimmer.style.opacity='0';
};
const applyProjectPreview=(media,project)=>{
  if(!media)return;
  const img=media.querySelector('.project-preview');
  if(!img)return;
  const repoName=project.name||'';
  const previewUrl=repoName?`https://opengraph.githubassets.com/1/ammaarM/${repoName}`:'';
  img.alt=`Preview of ${project.name}`;
  img.loading='lazy';
  img.decoding='async';
  img.width=640;
  img.height=360;
  if(previewUrl){img.hidden=false;img.src=previewUrl;
    const markReady=()=>media.classList.add('ready');
    img.addEventListener('load',markReady,{once:true});
    img.addEventListener('error',()=>{if(project.homepage){setFallbackContent(media,'homepage',project);}else{setFallbackContent(media,'gradient',project);}},{once:true});
    if(img.complete&&img.naturalWidth)markReady();
  }else if(project.homepage){setFallbackContent(media,'homepage',project);}else{setFallbackContent(media,'gradient',project);}
};
const renderProjects=(projects,{notice}={})=>{
  if(!projectsGrid||!projectTemplate)return;
  projectsGrid.innerHTML='';
  if(notice){const noticeEl=document.createElement('p');noticeEl.className='projects-notice';noticeEl.textContent=notice;projectsGrid.append(noticeEl);}
  if(!projects.length){projectsGrid.dataset.empty='true';const empty=document.createElement('p');empty.className='projects-empty';empty.textContent='No projects to show right now. Check back soon!';projectsGrid.append(empty);return;}
  projectsGrid.removeAttribute('data-empty');
  projects.forEach((project,index)=>{
    const card=projectTemplate.content.firstElementChild.cloneNode(true);
    card.setAttribute('data-reveal','');
    card.style.setProperty('--delay',`${Math.min(index,8)*120}ms`);
    const media=card.querySelector('.project-media');
    const title=card.querySelector('.project-title');
    const stars=card.querySelector('.project-stars');
    const description=card.querySelector('.project-description');
    const tags=card.querySelector('.project-tags');
    const repoLink=card.querySelector('.project-repo');
    const demoLink=card.querySelector('.project-demo');
    if(title)title.textContent=project.name;
    if(stars){stars.textContent=`⭐ ${project.stargazers_count}`;stars.setAttribute('aria-label',`${project.stargazers_count} GitHub stars`);}
    if(description)description.textContent=project.description||'A recent project by Ammaar Murshid.';
    if(tags){tags.innerHTML='';(project.topics||[]).slice(0,6).forEach(topic=>{const tag=document.createElement('span');tag.textContent=topic;tags.append(tag);});if(!tags.children.length)tags.remove();}
    if(repoLink){repoLink.href=project.html_url;repoLink.setAttribute('aria-label',`${project.name} repository`);}
    if(demoLink){if(project.homepage){demoLink.href=project.homepage;demoLink.hidden=false;}else{demoLink.hidden=true;}}
    applyProjectPreview(media,project);
    projectsGrid.append(card);
    if(revealObserver){revealObserver.observe(card);}else{card.classList.add('reveal');}
  });
};
const loadProjects=async()=>{
  if(!projectsGrid||!projectTemplate)return;
  const loading=document.createElement('p');
  loading.textContent='Loading projects…';
  loading.className='project-loading';
  projectsGrid.append(loading);
  try{
    const response=await fetch('https://api.github.com/users/ammaarM/repos?per_page=100',{headers:{Accept:'application/vnd.github+json'}});
    if(response.status===403&&response.headers.get('X-RateLimit-Remaining')==='0'){
      console.warn('GitHub API rate limit reached');
      renderProjects(fallbackProjects,{notice:'GitHub API rate limit hit. Try again later.'});
      return;
    }
    if(!response.ok)throw new Error(`GitHub API responded with ${response.status}`);
    const data=await response.json();
    const prepared=data.filter(repo=>!repo.fork&&!repo.archived).sort(projectSorter).slice(0,12).map(repo=>({
      ...repo,
      topics:Array.isArray(repo.topics)?repo.topics:[],
      pushed_at:repo.pushed_at||repo.updated_at
    }));
    renderProjects(prepared);
  }catch(error){
    console.error('GitHub projects failed to load',error);
    renderProjects(fallbackProjects);
  }
};
const updateActiveNav=sectionId=>{
  navLinks.forEach(link=>{
    const targetId=(link.getAttribute('href')||'').replace('#','');
    const isActive=targetId===sectionId;
    link.classList.toggle('is-active',isActive);
    if(isActive){link.setAttribute('aria-current','page');}else{link.removeAttribute('aria-current');}
  });
};
const motionHandler=event=>{if(event.matches){body.classList.add('prefers-reduced-motion');}else{body.classList.remove('prefers-reduced-motion');}};
const init=()=>{
  themeButton=document.querySelector('.theme-toggle');
  navToggle=document.querySelector('.nav-toggle');
  nav=document.querySelector('.site-nav');
  navLinks=[...document.querySelectorAll('.nav-link')];
  sections=[...document.querySelectorAll('section[data-section]')];
  scrollLinks=[...document.querySelectorAll('[data-scroll]')];
  projectsGrid=document.getElementById('projects-grid');
  projectTemplate=document.getElementById('project-card-template');
  yearTarget=document.querySelector('[data-year]');
  avatarImg=document.querySelector('.avatar img');
  revealGroups=[...document.querySelectorAll('[data-reveal-group]')];

  if(prefersReducedMotion){body.classList.add('prefers-reduced-motion');}
  if(yearTarget)yearTarget.textContent=new Date().getFullYear();
  window.requestAnimationFrame(()=>body.classList.add('is-ready'));

  if(navToggle&&nav){navToggle.addEventListener('click',()=>{const expanded=navToggle.getAttribute('aria-expanded')==='true';navToggle.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded);});}

  const revealTargets=[...document.querySelectorAll('[data-reveal]'),...revealGroups];
  revealObserver=(!prefersReducedMotion&&'IntersectionObserver'in window)?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('reveal');
      revealObserver.unobserve(entry.target);
    });
  },{threshold:0.2,rootMargin:'-10% 0px -5% 0px'}):null;
  if(revealObserver){revealTargets.forEach(target=>revealObserver.observe(target));}else{revealTargets.forEach(target=>target.classList.add('reveal'));}

  revealGroups.forEach(group=>{const items=[...group.querySelectorAll('[data-reveal-item]')];items.forEach((item,index)=>item.style.setProperty('--reveal-index',Math.min(index,8)));});

  scrollLinks.forEach(link=>{
    const href=link.getAttribute('href')||'';
    if(!href.startsWith('#'))return;
    const target=document.querySelector(href);
    if(!target)return;
    link.addEventListener('click',event=>{
      if(link.classList.contains('nav-link'))closeMobileNav();
      handleAnchorScroll(event,target);
    });
  });

  if(avatarImg){avatarImg.addEventListener('error',()=>{
    const wrapper=avatarImg.closest('.avatar');
    if(!wrapper||wrapper.classList.contains('is-fallback'))return;
    wrapper.classList.add('is-fallback');
    avatarImg.setAttribute('aria-hidden','true');
    avatarImg.hidden=true;
    const initials=wrapper.dataset.initials||'AM';
    const svgNS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(svgNS,'svg');
    svg.setAttribute('viewBox','0 0 64 64');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    svg.style.color='var(--accent)';
    const circle=document.createElementNS(svgNS,'circle');
    circle.setAttribute('cx','32');
    circle.setAttribute('cy','32');
    circle.setAttribute('r','28');
    circle.setAttribute('fill','rgba(111,140,255,0.18)');
    const text=document.createElementNS(svgNS,'text');
    text.setAttribute('x','50%');
    text.setAttribute('y','54%');
    text.setAttribute('text-anchor','middle');
    text.setAttribute('font-size','26');
    text.setAttribute('font-weight','700');
    text.setAttribute('fill','currentColor');
    text.textContent=initials;
    svg.append(circle,text);
    wrapper.append(svg);
    wrapper.setAttribute('role','img');
    wrapper.setAttribute('aria-label',`Initials for ${initials}`);
  });}

  initTheme();
  if(sections.length&&navLinks.length){if(!prefersReducedMotion&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)updateActiveNav(entry.target.id);});},{threshold:0.45,rootMargin:'-35% 0px -45% 0px'});sections.forEach(section=>observer.observe(section));}else{const handleScroll=()=>{const scrollY=window.scrollY+window.innerHeight*0.35;let currentId=sections[0].id;sections.forEach(section=>{if(scrollY>=section.offsetTop)currentId=section.id;});updateActiveNav(currentId);};handleScroll();window.addEventListener('scroll',handleScroll,{passive:true});}}

  loadProjects();
};
const closeMobileNav=()=>{if(!navToggle||!nav)return;navToggle.setAttribute('aria-expanded','false');nav.classList.remove('open');};
if(reduceMotionMedia.addEventListener){reduceMotionMedia.addEventListener('change',motionHandler);}else if(reduceMotionMedia.addListener){reduceMotionMedia.addListener(motionHandler);}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init,{once:true});}else{init();}
