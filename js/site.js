/* Custom Flooring Projects — shared interactions */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.matchMedia('(min-width: 1025px) and (pointer: fine)').matches;

  /* nav scrolled state */
  var nav = document.getElementById('nav');
  if (nav){
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* mobile menu */
  var burger = document.querySelector('.burger');
  if (burger){
    burger.addEventListener('click', function(){ document.documentElement.classList.toggle('menu-open'); });
    document.querySelectorAll('.mobile-menu a').forEach(function(a){
      a.addEventListener('click', function(){ document.documentElement.classList.remove('menu-open'); });
    });
  }

  /* form submit note */
  document.querySelectorAll('form.quote, form.cta-quote').forEach(function(qf){
    qf.addEventListener('submit', function(){ var b = qf.querySelector('.btn span'); if (b) b.textContent = 'Sending…'; });
  });

  /* hero background video — ensure muted autoplay */
  (function(){
    var hv = document.querySelector('.hero-video');
    if (!hv) return;
    hv.muted = true;
    var tryPlay = function(){ var p = hv.play(); if (p && p.catch) p.catch(function(){}); };
    tryPlay();
    document.addEventListener('visibilitychange', function(){ if (!document.hidden) tryPlay(); });
    window.addEventListener('pointerdown', tryPlay, { once:true });
  })();

  /* lightweight reveals via IntersectionObserver (no scroll handlers) */
  if (!reduce && 'IntersectionObserver' in window){
    document.documentElement.classList.add('reveals');
    var rio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    document.querySelectorAll('.reveal-fade, .reveal-line').forEach(function(el){ rio.observe(el); });
  }

  /* gapless grid masonry — sizes each item to its image height (once per image) */
  (function(){
    var grids = document.querySelectorAll('.masonry');
    if (!grids.length) return;
    var ROW = 10, GAP = 14;
    function span(a){ if(!a) return; var img = a.querySelector('img'); if(!img) return; var h = img.getBoundingClientRect().height; if(!h) return; a.style.gridRowEnd = 'span ' + Math.max(1, Math.ceil((h + GAP) / (ROW + GAP))); }
    function all(){ grids.forEach(function(g){ g.querySelectorAll('a').forEach(span); }); }
    document.querySelectorAll('.masonry img').forEach(function(img){
      if (img.complete && img.naturalWidth) span(img.closest('a'));
      else img.addEventListener('load', function(){ span(img.closest('a')); });
    });
    var t; window.addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(all, 200); }, {passive:true});
    window.addEventListener('load', all);
  })();

  /* TikTok facade — load the real player only when a card is clicked */
  (function(){
    var cards = document.querySelectorAll('.tt-card');
    if (!cards.length) return;
    function play(card){
      var id = card.getAttribute('data-id');
      var bq = document.createElement('blockquote');
      bq.className = 'tiktok-embed';
      bq.setAttribute('cite', 'https://www.tiktok.com/@customfloorpro/video/' + id);
      bq.setAttribute('data-video-id', id);
      bq.style.cssText = 'max-width:605px;min-width:325px;margin:0';
      bq.innerHTML = '<section><a href="https://www.tiktok.com/@customfloorpro/video/' + id + '" target="_blank" rel="noopener">@customfloorpro</a></section>';
      card.replaceWith(bq);
      var s = document.createElement('script'); s.async = true; s.src = 'https://www.tiktok.com/embed.js'; document.body.appendChild(s);
    }
    cards.forEach(function(card){ card.addEventListener('click', function(){ play(card); }); });
  })();

  /* Instagram — preview the reel inline in a modal (embed still links out to Instagram) */
  (function(){
    var cards = document.querySelectorAll('.ig-card');
    var modal = document.getElementById('igModal');
    if (!cards.length || !modal) return;
    var body = modal.querySelector('.ig-modal-body');
    var link = modal.querySelector('.ig-modal-link');
    function open(code, href){
      body.innerHTML = '<iframe src="https://www.instagram.com/reel/' + code + '/embed/" scrolling="no" allowtransparency="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen title="Instagram reel"></iframe>';
      if (link && href) link.href = href;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
    }
    function close(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); body.innerHTML = ''; document.documentElement.style.overflow = ''; }
    cards.forEach(function(card){
      card.addEventListener('click', function(e){ e.preventDefault(); open(card.getAttribute('data-code'), card.getAttribute('href')); });
    });
    modal.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click', close); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
  })();

  /* carousels — prev/next buttons + swipe (each .htrack paired with its preceding nav) */
  document.querySelectorAll('.htrack').forEach(function(track){
    var nav = track.previousElementSibling;
    while (nav && !(nav.querySelector && nav.querySelector('[data-car]'))) nav = nav.previousElementSibling;
    var prev = nav && nav.querySelector('[data-car="prev"]');
    var next = nav && nav.querySelector('[data-car="next"]');
    function gap(){ return parseFloat(getComputedStyle(track).columnGap) || 20; }
    function step(){ var card = track.firstElementChild; return card ? card.getBoundingClientRect().width + gap() : track.clientWidth * 0.85; }
    function maxScroll(){ return track.scrollWidth - track.clientWidth; }
    function animateTo(target){
      target = Math.max(0, Math.min(target, maxScroll()));
      var start = track.scrollLeft, dist = target - start;
      if (Math.abs(dist) < 1) return;
      var t0 = performance.now(), dur = 450;
      function frame(now){ var p = Math.min(1, (now - t0) / dur); track.scrollLeft = start + dist * (1 - Math.pow(1 - p, 3)); if (p < 1) requestAnimationFrame(frame); }
      requestAnimationFrame(frame);
    }
    function go(dir){ var s = step(); animateTo((Math.round(track.scrollLeft / s) + dir) * s); }
    function update(){ if (!prev || !next) return; prev.disabled = track.scrollLeft <= 4; next.disabled = track.scrollLeft >= maxScroll() - 4; }
    if (prev) prev.addEventListener('click', function(){ go(-1); });
    if (next) next.addEventListener('click', function(){ go(1); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });

  var hasGSAP = window.gsap && window.ScrollTrigger;
  if (reduce || !hasGSAP) return;
  gsap.registerPlugin(ScrollTrigger);

  /* native scroll — no smooth-scroll library (it caused lag-then-jump on heavy pages) */

  /* magnetic buttons (pointer devices) */
  if (isDesktop){
    document.querySelectorAll('[data-magnetic]').forEach(function(el){
      el.addEventListener('mousemove',function(e){ var r=el.getBoundingClientRect();
        gsap.to(el,{x:(e.clientX-r.left-r.width/2)*0.3,y:(e.clientY-r.top-r.height/2)*0.4,duration:.5,ease:'power3.out'}); });
      el.addEventListener('mouseleave',function(){ gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,0.4)'}); });
    });
  }

  /* hero headline mask (one-time on load) */
  if (document.querySelector('h1 .ln > span')){
    gsap.set('h1 .ln > span',{yPercent:115});
    gsap.to('h1 .ln > span',{yPercent:0,duration:1.2,ease:'expo.out',stagger:0.1,delay:0.1});
  }

  /* parallax — DESKTOP ONLY (scrub work janks on mobile) */
  if (isDesktop){
    gsap.utils.toArray('[data-parallax]').forEach(function(el){
      var amt=parseFloat(el.getAttribute('data-parallax'))||0.12;
      gsap.to(el,{yPercent:amt*100,ease:'none',
        scrollTrigger:{trigger:el.closest('section')||el.closest('header')||el,start:'top bottom',end:'bottom top',scrub:true}});
    });
    gsap.utils.toArray('.figure .img').forEach(function(img){
      gsap.fromTo(img,{scale:1.12},{scale:1,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:img,start:'top 88%',once:true}});
    });
  } else {
    gsap.utils.toArray('.figure .img').forEach(function(img){ gsap.set(img,{scale:1}); });
  }

  /* counters */
  gsap.utils.toArray('.count').forEach(function(el){
    var to=parseFloat(el.getAttribute('data-to')), dec=parseInt(el.getAttribute('data-dec')||'0',10), obj={v:0};
    gsap.to(obj,{v:to,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},
      onUpdate:function(){ el.textContent = dec? obj.v.toFixed(dec) : Math.round(obj.v).toLocaleString(); }});
  });

  window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
})();
