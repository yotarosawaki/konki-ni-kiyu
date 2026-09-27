// ===== プレイ回数・BAD END回数の かんたん集計 =====
// 外部の 無料カウンターサービス（abacus.jasoncameron.dev）を つかう。
// サインアップ不要で 使える 反面、認証は なく、だれでも 数を いじれる ため、
// この数字は「だいたいの 目安」であって、正確な 統計調査 では ない。
// 公開サイト以外（手元での確認、非公開プレビュー）では 送らない。
'use strict';
(function () {
  var HOSTS = ['yotarosawaki.github.io', 'games.cf-m.jp', 'konki.cf-m.jp'];
  var NS = 'konki-ni-kiyu-v1';
  var enabled = HOSTS.indexOf(location.hostname) >= 0;

  window.counterBump = function (key) {
    if (!enabled) return;
    try { fetch('https://abacus.jasoncameron.dev/hit/' + NS + '/' + key, { mode: 'cors' }).catch(function () { }); } catch (e) { }
  };
})();
