/* Custom Flooring Projects — shared interactions */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav scrolled state */
  var nav = document.getElementById('nav');
  if (nav){
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* mobile menu */
  var burger = document.querySelector('.burger');
  if (burger){
    burger.addEventListener('click', function(){
      document.documentElement.classList.toggle('menu-open');
    });
    document.querySelectorAll('.mobile-menu a').forEach(function(a){
      a.addEventListener('click', function(){ document.documentElement.classList.remove('menu-open'); });
    });
  }

  /* contact form -> graceful note (FormSubmit handles the POST) */
  var qf = document.querySelector('form.quote');
  if (qf){
    qf.addEventListener('submit', function(){
      var b = qf.querySelector('.btn span'); if (b) b.textContent = 'Sending…';
    });
  }

  /* hero background video — ensure autoplay (muted) across browsers */
  (function(){
    var hv = document.querySelector('.hero-video');
    if (!hv) return;
    hv.muted = true;
    var tryPlay = function(){ var p = hv.play(); if (p && p.catch) p.catch(function(){}); };
    tryPlay();
    document.addEventListener('visibilitychange', function(){ if (!document.hidden) tryPlay(); });
    window.addEventListener('pointerdown', tryPlay, { once:true });
  })();

  /* gapless grid masonry — sizes each item to its image height */
  (function(){
    var grids = document.querySelectorAll('.masonry');
    if (!grids.length) return;
    var ROW = 10, GAP = 14;
    var rt;
    function refreshST(){ if (window.ScrollTrigger){ clearTimeout(rt); rt = setTimeout(function(){ ScrollTrigger.refresh(); }, 180); } }
    function span(a){ if(!a) return; var img = a.querySelector('img'); if(!img) return; var h = img.getBoundingClientRect().height; if(!h) return; a.style.gridRowEnd = 'span ' + Math.max(1, Math.ceil((h + GAP) / (ROW + GAP))); }
    function all(){ grids.forEach(function(g){ g.querySelectorAll('a').forEach(span); }); refreshST(); }
    document.querySelectorAll('.masonry img').forEach(function(img){
      if (img.complete && img.naturalWidth) span(img.closest('a'));
      else img.addEventListener('load', function(){ span(img.closest('a')); refreshST(); });
    });
    var t; window.addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(all, 150); });
    window.addEventListener('load', all);
  })();

  /* projects carousel — prev/next buttons + swipe */
  (function(){
    var track = document.getElementById('workTrack');
    if (!track) return;
    var prev = document.querySelector('[data-car="prev"]');
    var next = document.querySelector('[data-car="next"]');
    function step(){ var card = track.querySelector('.mat'); return card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.85; }
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
    function update(){
      if (!prev || !next) return;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= maxScroll() - 4;
    }
    if (prev) prev.addEventListener('click', function(){ go(-1); });
    if (next) next.addEventListener('click', function(){ go(1); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  var hasGSAP = window.gsap && window.ScrollTrigger;
  if (reduce || !hasGSAP) return;
  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  var lenis = window.Lenis ? new Lenis({duration:1.1, easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t));}}) : null;
  if (lenis){
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* magnetic */
  document.querySelectorAll('[data-magnetic]').forEach(function(el){
    el.addEventListener('mousemove',function(e){ var r=el.getBoundingClientRect();
      gsap.to(el,{x:(e.clientX-r.left-r.width/2)*0.3,y:(e.clientY-r.top-r.height/2)*0.4,duration:.5,ease:'power3.out'}); });
    el.addEventListener('mouseleave',function(){ gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,0.4)'}); });
  });

  /* hero headline mask */
  if (document.querySelector('h1 .ln > span')){
    gsap.set('h1 .ln > span',{yPercent:115});
    gsap.to('h1 .ln > span',{yPercent:0,duration:1.25,ease:'expo.out',stagger:0.1,delay:0.12});
  }

  /* reveals */
  gsap.utils.toArray('.reveal-line > span').forEach(function(s){
    gsap.set(s,{yPercent:115});
    gsap.to(s,{yPercent:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:s,start:'top 94%',once:true,invalidateOnRefresh:true}});
  });
  gsap.utils.toArray('.reveal-fade').forEach(function(el){
    gsap.set(el,{y:32,opacity:0});
    gsap.to(el,{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true,invalidateOnRefresh:true}});
  });

  /* parallax */
  gsap.utils.toArray('[data-parallax]').forEach(function(el){
    var amt=parseFloat(el.getAttribute('data-parallax'))||0.12;
    gsap.to(el,{yPercent:amt*100,ease:'none',
      scrollTrigger:{trigger:el.closest('section')||el.closest('header')||el,start:'top bottom',end:'bottom top',scrub:true}});
  });

  /* figure scale-in */
  gsap.utils.toArray('.figure .img').forEach(function(img){
    gsap.to(img,{scale:1,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:img,start:'top 88%'}});
  });

  /* counters (data-to) */
  gsap.utils.toArray('.count').forEach(function(el){
    var to=parseFloat(el.getAttribute('data-to')), dec=parseInt(el.getAttribute('data-dec')||'0',10), obj={v:0};
    gsap.to(obj,{v:to,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%'},
      onUpdate:function(){ el.textContent = dec? obj.v.toFixed(dec) : Math.round(obj.v).toLocaleString(); }});
  });

  /* safety net: never leave in-viewport text stuck hidden if a trigger mis-fires */
  function revealSafety(){
    gsap.utils.toArray('.reveal-fade, .reveal-line > span').forEach(function(el){
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.98 && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < 0.05){
        gsap.to(el,{opacity:1,y:0,yPercent:0,duration:.5,overwrite:true});
      }
    });
  }
  var rsf;
  window.addEventListener('scroll', function(){ clearTimeout(rsf); rsf = setTimeout(revealSafety, 120); }, {passive:true});
  window.addEventListener('load', function(){ ScrollTrigger.refresh(); setTimeout(revealSafety, 300); });
  setTimeout(function(){ ScrollTrigger.refresh(); revealSafety(); }, 800);
})();
