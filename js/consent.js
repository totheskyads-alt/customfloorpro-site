/* Consent banner — Consent Mode v2, self-hosted (fara CMP extern).
   Perechea lui e blocul inline din <head> care seteaza starile implicite
   INAINTE de GTM. Aici e doar interfata + trimiterea deciziei. */
(function () {
  'use strict';
  var KEY = 'cfp_consent_v1';
  var gtag = window.gtag || function () { (window.dataLayer = window.dataLayer || []).push(arguments); };

  function saved() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function store(analytics, marketing) {
    var state = {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    gtag('consent', 'update', state);
    (window.dataLayer = window.dataLayer || []).push({
      event: 'consent_update',
      consent_analytics: analytics ? 'granted' : 'denied',
      consent_marketing: marketing ? 'granted' : 'denied'
    });
    return state;
  }

  var CSS = ''
    + '#cfp-cc{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:none;'
    + 'padding:18px clamp(16px,4vw,40px) calc(18px + env(safe-area-inset-bottom))}'
    + '#cfp-cc.on{display:block}'
    + '#cfp-cc .cc-in{max-width:1180px;margin:0 auto;background:oklch(0.155 0.012 58 / .97);'
    + 'border:1px solid oklch(1 0 0 / .14);border-radius:18px;padding:clamp(18px,2.4vw,26px);'
    + 'box-shadow:0 18px 60px oklch(0.06 0.01 60 / .6);backdrop-filter:blur(10px);'
    + 'color:oklch(0.93 0.008 70);font-family:"Plus Jakarta Sans",system-ui,sans-serif;position:relative}'
    + '#cfp-cc h2{font-size:17px;font-weight:700;margin:0 0 7px;color:#fff;letter-spacing:-.01em}'
    + '#cfp-cc p{margin:0;font-size:14.5px;line-height:1.55;color:oklch(0.82 0.01 70);max-width:70ch}'
    + '#cfp-cc a{color:#E2AC5E;text-decoration:underline;text-underline-offset:3px}'
    + '#cfp-cc .cc-row{display:flex;gap:26px;align-items:flex-start;flex-wrap:wrap;justify-content:space-between}'
    + '#cfp-cc .cc-txt{flex:1 1 380px;min-width:260px;padding-right:26px}'
    + '#cfp-cc .cc-acts{display:flex;gap:10px;align-items:center;flex-wrap:wrap}'
    + '#cfp-cc button{font:inherit;cursor:pointer;border-radius:999px;padding:11px 22px;'
    + 'font-size:14.5px;font-weight:600;border:1px solid transparent;min-height:44px;transition:.2s}'
    + '#cfp-cc .cc-yes{background:#F3EDE4;color:#100B07}'
    + '#cfp-cc .cc-no{background:transparent;color:#F3EDE4;border-color:oklch(1 0 0 / .34)}'
    + '#cfp-cc .cc-yes:hover{background:#E2AC5E}'
    + '#cfp-cc .cc-no:hover{border-color:#E2AC5E;color:#E2AC5E}'
    + '#cfp-cc .cc-prefs{background:none;border:none;color:oklch(0.78 0.01 70);text-decoration:underline;'
    + 'text-underline-offset:3px;padding:11px 6px;font-weight:500}'
    + '#cfp-cc .cc-prefs:hover{color:#E2AC5E}'
    + '#cfp-cc .cc-x{position:absolute;top:10px;right:12px;background:none;border:none;color:oklch(0.7 0.01 70);'
    + 'font-size:22px;line-height:1;padding:8px 10px;min-height:0}'
    + '#cfp-cc .cc-x:hover{color:#fff}'
    + '#cfp-cc .cc-panel{display:none;margin-top:18px;padding-top:16px;border-top:1px solid oklch(1 0 0 / .13)}'
    + '#cfp-cc .cc-panel.on{display:block}'
    + '#cfp-cc .cc-opt{display:flex;gap:14px;align-items:flex-start;padding:11px 0}'
    + '#cfp-cc .cc-opt b{display:block;font-size:14.5px;color:#fff;font-weight:600;margin-bottom:3px}'
    + '#cfp-cc .cc-opt span{font-size:13.5px;color:oklch(0.76 0.01 70);line-height:1.5}'
    + '#cfp-cc .cc-opt input{width:20px;height:20px;margin-top:3px;accent-color:#E2AC5E;flex:none}'
    + '#cfp-cc button:focus-visible,#cfp-cc input:focus-visible{outline:2px solid #E2AC5E;outline-offset:2px}'
    + '@media(max-width:720px){#cfp-cc .cc-txt{padding-right:0}#cfp-cc .cc-acts{width:100%}'
    + '#cfp-cc .cc-acts button.cc-yes,#cfp-cc .cc-acts button.cc-no{flex:1 1 46%}}';

  var HTML = ''
    + '<div class="cc-in" role="dialog" aria-modal="false" aria-labelledby="cc-h" aria-describedby="cc-p">'
    + '<button class="cc-x" type="button" data-cc="reject" aria-label="Close and reject non-essential cookies">&times;</button>'
    + '<div class="cc-row">'
    + '<div class="cc-txt"><h2 id="cc-h">Cookies on this site</h2>'
    + '<p id="cc-p">We use essential cookies to make the site work. With your permission we also use '
    + 'analytics and marketing cookies to understand how the site is used and to measure our advertising. '
    + 'You can change your mind at any time. See our <a href="/cookies.html">Cookie Policy</a>.</p></div>'
    + '<div class="cc-acts">'
    + '<button class="cc-no" type="button" data-cc="reject">Reject all</button>'
    + '<button class="cc-yes" type="button" data-cc="accept">Accept all</button>'
    + '<button class="cc-prefs" type="button" data-cc="toggle">Preferences</button>'
    + '</div></div>'
    + '<div class="cc-panel" id="cc-panel">'
    + '<div class="cc-opt"><input type="checkbox" id="cc-nec" checked disabled aria-describedby="cc-nec-d">'
    + '<label for="cc-nec"><b>Strictly necessary</b><span id="cc-nec-d">Required for the site to load and for the '
    + 'estimate form to work. These are always on.</span></label></div>'
    + '<div class="cc-opt"><input type="checkbox" id="cc-ana" aria-describedby="cc-ana-d">'
    + '<label for="cc-ana"><b>Analytics</b><span id="cc-ana-d">Helps us see which pages people visit, so we can '
    + 'improve the site. Never used to identify you personally.</span></label></div>'
    + '<div class="cc-opt"><input type="checkbox" id="cc-mkt" aria-describedby="cc-mkt-d">'
    + '<label for="cc-mkt"><b>Marketing</b><span id="cc-mkt-d">Lets us measure our advertising and show relevant '
    + 'ads to people who visited this site.</span></label></div>'
    + '<div class="cc-acts" style="margin-top:12px">'
    + '<button class="cc-yes" type="button" data-cc="save">Save my choices</button></div>'
    + '</div></div>';

  function build() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    var el = document.createElement('div');
    el.id = 'cfp-cc';
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = HTML;
    document.body.appendChild(el);

    var panel = el.querySelector('#cc-panel');
    var ana = el.querySelector('#cc-ana');
    var mkt = el.querySelector('#cc-mkt');

    function close() { el.classList.remove('on'); }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]');
      if (!b) return;
      var a = b.getAttribute('data-cc');
      if (a === 'toggle') {
        var open = panel.classList.toggle('on');
        b.textContent = open ? 'Hide preferences' : 'Preferences';
        return;
      }
      if (a === 'accept') { store(true, true); close(); }
      else if (a === 'reject') { store(false, false); close(); }
      else if (a === 'save') { store(ana.checked, mkt.checked); close(); }
    });

    window.cfpCookieSettings = function () {
      var s = saved();
      ana.checked = !!s && s.analytics_storage === 'granted';
      mkt.checked = !!s && s.ad_storage === 'granted';
      panel.classList.add('on');
      el.querySelector('[data-cc="toggle"]').textContent = 'Hide preferences';
      el.classList.add('on');
      el.querySelector('.cc-yes').focus();
    };

    if (!saved()) el.classList.add('on');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();

  /* link „Cookie settings" din footer */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cookie-settings]');
    if (t) { e.preventDefault(); if (window.cfpCookieSettings) window.cfpCookieSettings(); }
  });
})();
