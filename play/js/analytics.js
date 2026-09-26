// ===== アクセス解析（Google アナリティクス 4）=====
// GA_ID に測定ID（G-XXXXXXXXXX）を入れると有効になる。空のままなら、何も送らない。
// 公開サイト以外（手元での確認、非公開プレビュー）では、IDが入っていても送らない。
// 送るのは、ページの表示と、下の track() で決めた操作だけ。名前などの個人情報は扱わない。
'use strict';
(function () {
  var GA_ID = 'G-PXVLNR5XBK';
  var HOSTS = ['yotarosawaki.github.io', 'games.cf-m.jp'];

  window.track = function () { };
  if (!GA_ID || HOSTS.indexOf(location.hostname) < 0) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GA_ID);

  // ページを開いたまま別のページへ移る操作でも取りこぼさないよう、beacon で送る
  window.track = function (name, params) {
    try { gtag('event', name, Object.assign({ transport_type: 'beacon' }, params || {})); } catch (e) { }
  };

  // 「アクセス解析を使っています」の一文は、計測が有効なときだけ表示する
  function showNotes() { document.querySelectorAll('[data-analytics-note]').forEach(function (el) { el.hidden = false; }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showNotes); else showNotes();
})();
