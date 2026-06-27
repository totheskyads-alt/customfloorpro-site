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

  /* gapless grid masonry — sizes each item to its image height */
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
    var t; window.addEventListener('resize', function(){ clearTimeout(t); t = setTimeout(all, 150); });
    window.addEventListener('load', all);
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
    gsap.to(s,{yPercent:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:s,start:'top 90%'}});
  });
  gsap.utils.toArray('.reveal-fade').forEach(function(el){
    gsap.set(el,{y:32,opacity:0});
    gsap.to(el,{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%'}});
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

  /* horizontal pinned gallery */
  var track=document.querySelector('.htrack');
  if (track && innerWidth>860){
    var scrollLen=track.scrollWidth - innerWidth + 80;
    gsap.to(track,{x:-scrollLen,ease:'none',
      scrollTrigger:{trigger:'.hpin',start:'top top',end:'+='+scrollLen,scrub:1,pin:true,anticipatePin:1}});
  }

  /* counters (data-to) */
  gsap.utils.toArray('.count').forEach(function(el){
    var to=parseFloat(el.getAttribute('data-to')), dec=parseInt(el.getAttribute('data-dec')||'0',10), obj={v:0};
    gsap.to(obj,{v:to,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%'},
      onUpdate:function(){ el.textContent = dec? obj.v.toFixed(dec) : Math.round(obj.v).toLocaleString(); }});
  });

  window.addEventListener('load',function(){ ScrollTrigger.refresh(); });
})();
