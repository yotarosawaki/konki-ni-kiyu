// ===== 婚期に消ゆ : シナリオ =====
'use strict';
const NAMES = { yasu: 'タツ', misaki: 'ミサキ', yui: 'ユイ', reiko: 'レイコ', haruka: 'ハルカ', shiori: 'シオリ', boss: 'ぶちょう', nishida: 'ニシダ', mom: 'はは', dad: 'ちち', goto: 'ゴトウ', clerk: 'てんいん' };

const YASU = [
  '結婚は いいぞ。……たまにな',
  '嫁の 機嫌は、天気予報より 当たらん',
  '独身の 頃の 俺に 言いたい。「その 自由、ちゃんと 使えよ」ってな',
  '子どもは かわいい。睡眠は もう ない',
  'お前は 条件で 考えすぎ。仕様書じゃ ないんだから',
  '婚活は 障害対応と 同じだ。ログを 見ろ。……相手のな',
  '「いい人」は 褒め言葉じゃ ない。覚えとけ',
  '完璧な タイミングなんて 来ない。本番リリースと 同じだ',
  '相手の 話を 最後まで 聞け。解決策は 聞かれてから 出せ'
];

const ITEM_DESC = {
  'ポッキー': 'ミサキに もらった ポッキー。1本。\n……賞味期限は まだ 大丈夫だ。',
  'ハガキ': '中学の 同窓会の ハガキ。\n「3年2組 同窓会 6月14日 居酒屋 とりきん」',
  'かりた本': 'シオリに すすめられた 本。『夜の 図書館』。\n返却期限は 2週間後。',
  'としょカード': '中学の 図書室の 貸出カード。\n『夜の 図書館』。オレと 真壁 シオリの 名前が、交互に 並んでいる。',
  'ゆびわ': 'シンプルな 婚約指輪。\n小さな ダイヤが ひとつ。',
  'たかい ゆびわ': '給料 3か月分の 婚約指輪。\nダイヤが でかい。値段は もっと でかい。',
  'ゆびわの カタログ': '宝石店の カタログ。\n「ふたりで 選ぶ、ふたりの 指輪」と 書いてある。'
};
const USE = {
  'ポッキー': async () => { take('ポッキー'); await say('ポッキーを 食べた。', '……1本 だった。'); },
  'ハガキ': async () => { await say('ハガキを 読み返した。', '「みんなの 近況 聞かせてね！ 幹事：ゴトウ」'); },
  'かりた本': async () => {
    if (G.loc !== 'home') { await say('ここでは 集中 できない。家で 読もう。'); return; }
    const k = G.f.read = (G.f.read || 0) + 1;
    if (k === 1) await say('本を 開いた。', '……3ページで 寝た。');
    else if (k === 2) await say('続きを 読んだ。', '夜の 図書館で、本たちが 目を 覚ます 話 らしい。', '……半分で 寝た。');
    else if (k === 3) { await say('最後まで 読んだ。', '「本は、返されるために 貸されるのではない。また 借りられる ために 返されるのだ」', '……最後の 一文が、なぜか 胸に 残った。'); mental(3); }
    else await say('もう 読み終わった。……2周目は 返してから にしよう。');
  },
  'としょカード': async () => { await say('カードを 見つめた。', '……あの頃の オレに 教えて やりたい。', 'お前、その 名前の 人と、20年後に また 会うぞ。'); },
  'ゆびわ': async () => { await say('箱を 開けて、閉じた。', '開けて、閉じた。', '……10回 くらい やった。'); },
  'たかい ゆびわ': async () => { await say('箱を 開けた。まぶしい。', '……ボーナスが 指輪に 化けた 瞬間を 思い出した。'); },
  'ゆびわの カタログ': async () => { await say('カタログを めくった。', 'どれも 同じに 見える。……一緒に 選べば、違いが わかるんだろうか。'); }
};

async function topics(prompt, list) {
  const av = list.filter(x => (!x.if || x.if()) && (!x.once || !G.f['_t_' + x.once]));
  if (!av.length) return false;
  const i = await ask(prompt, av.map(x => x.t).concat(['なんでもない']));
  if (i === av.length) { await say('……なんでもない。'); return true; }
  const x = av[i]; if (x.once) G.f['_t_' + x.once] = 1;
  await x.fn(); return true;
}

// ================= 場所 =================
const LOCS = {
  // ---------- 自宅 ----------
  home: {
    name: 'じたく', bg: 'home', people: () => [],
    look: async () => {
      if (G.f.cleaned) await say('片付いた 1K。床が 見える。', '……床って こんな 色 だったのか。');
      else await say('散らかった 1K。モニターが 3枚。ベッドの 上には 洗濯物の 山。', 'ここで 眠り、ここで 働き、ここで 33歳に なった。');
    },
    exam: () => {
      const o = {
        'かがみ': async () => {
          if (G.ch === 1 && once('mirror')) {
            await say('33歳の 男が 映っている。', '寝ぐせ。無精ひげ。目の下の クマ。\n……だれだ これは。');
            const i = await ask('どうする？', ['ひげを そる', 'ありのままで いい']);
            if (i === 0) { G.f.shaved = true; await say('ひげを そった。', '少しだけ、人間に 近づいた 気がする。'); mental(3); }
            else await say('ありのままの オレを 愛して くれる 人が、どこかに いるはずだ。', '……たぶん。');
            return;
          }
          await say(pick(['鏡の 中の オレは、今日も 33歳だ。', '……前髪が 少し 後退した 気がする。\n気のせいだ。気のせいで あってくれ。', '「いける」。鏡に むかって 言ってみた。\n鏡は 何も 言わなかった。']));
        },
        'モニター': async () => {
          await say(['', 'Slackの 未読：128件。\n……明日の オレに まかせよう。', 'Slackの 未読：256件。\n2倍に なった。2の 累乗で 増えている。', '検索履歴に「同窓会 何を 話す」が 並んでいる。\n……消した。', 'GitHubの 草は 毎日 生えている。\n恋愛の 草は 生えていない。', '検索履歴に「告白 タイミング 30代」。\n……消した。', 'シオリとの LINEの 画面を 開いたまま、30分 たっていた。', 'カレンダーの 12月24日に、ただ「★」とだけ 入力されている。', ''][G.ch]);
        },
        'れいぞうこ': async () => { await say(G.ch >= 4 ? '麦茶が 冷えている。作る ように なった。\n……成長だ。' : 'エナジードリンクと、からし。', G.ch >= 4 ? 'からしは まだ ある。' : '……からしは 何のために 買ったんだっけ。'); },
        'かんようしょくぶつ': async () => {
          if (!G.f.plant) {
            await say('鉢植えが 枯れている。', '……水を やると 決めた 日から、3年 たっていた。');
            const i = await ask('どうする？', ['みずを やる', 'そのまま']);
            if (i === 0) { G.f.plant = 1; await say('水を やった。', '……手遅れ かも しれない。\nでも、やらないよりは いい。'); }
            return;
          }
          if (G.ch >= 3) {
            if (once('sprout')) { scene('home'); await say('……新しい 芽が 出ている！', '枯れたと 思っていたのに。'); mental(8); }
            else await say('葉っぱが 増えてきた。\n水やりは、毎朝の 習慣に なった。');
          } else await say('まだ 枯れた ままだ。', '……でも、土は しめっている。');
        },
        'せんたくもの': async () => {
          if (G.f.cleaned) { await say('たたまれた 服が ならんでいる。'); return; }
          const i = await ask('洗濯物の 山だ。3週間分 ある。', ['たたむ', 'みなかった ことに する']);
          if (i === 1) { await say('……見なかった ことに した。'); return; }
          if (n('fold') < 2) await say('半分 たたんだ ところで 力尽きた。', '……続きは また こんど だ。');
          else { G.f.cleaned = true; scene('home'); await say('全部 たたんだ。', '床が 見えた。フローリング だった。'); mental(5); }
        }
      };
      if (G.ch === 3 && !G.f.hagaki) o['ポスト'] = async () => {
        await say('ポストに ハガキが 届いている。', '「3年2組 同窓会の おしらせ\n6月14日 居酒屋 とりきん」', '……中学の 同窓会だ。');
        give('ハガキ'); G.f.hagaki = true;
        await say('（いどう先に「どうそうかい」が 追加された）');
      };
      return o;
    }
  },

  // ---------- 会社 ----------
  office: {
    name: 'かいしゃ', bg: 'office',
    people: () => G.ch <= 7 ? ['yasu', 'misaki', 'boss', 'nishida'].filter(p => p !== 'misaki' || G.ch <= 6) : [],
    look: async () => { await say('オープン オフィス。', 'キーボードの 音と、空調の 音だけが 響いている。', G.ch === 7 ? 'カレンダーに「12/24 リリース」の 赤い 丸。' : '今日も 誰かが どこかで デプロイしている。'); },
    exam: () => {
      const o = {
        'デスク': async () => { await say(pick(['エナジードリンクの 空き缶で、ピラミッドが できている。', '付箋に「TODO：人生」と 書いてある。\n……いつ 書いたんだ。', 'キーボードの Enterキーだけ、文字が 消えている。'])); },
        'ホワイトボード': async () => {
          await say(G.ch === 7 ? '「12/24 本番リリース」\n……クリスマス イブに リリース。正気か。' : G.ch >= 4 ? '「オンコール当番：（空欄）」\n……空欄は、つまり オレだ。' : '「リリース日：未定」\n未定のまま 3か月 たっている。');
        },
        'まど': async () => { await say('窓の 外は 晴れ。', '昼休みに、公園で 弁当を 分けあう カップルが 見える。', '……オレの 昼食は、キーボードの 横の カロリーバーだ。'); }
      };
      if (G.ch <= 6) o['ミサキ'] = async () => {
        face('misaki', 'n');
        if (G.ch <= 2) await say('ミサキの 左手の 薬指に、絆創膏が 巻いてある。', '……紙で 切ったのかな。');
        else if (G.ch <= 4) await say('ミサキは、左手の 薬指を 右手で そっと 隠している。', '……クセ なのかな。');
        else { await say('ミサキの 左手の 薬指で、ダイヤが 光っている。', '……絆創膏の 下に あったのは、これか。'); G.f.sawRing = true; }
      };
      return o;
    },
    talk: {
      yasu: async () => {
        if (G.ch === 1 && !G.f.appHint) {
          await say('タツ「おう。誕生日 おめでとう。33か」', 'タツは 同期だ。28で 結婚し、今は 2児の 父。', 'タツ「で、どうすんの。そろそろ」');
          const i = await ask('どうこたえる？', ['けっこん したい', 'べつに いまのままで いい']);
          if (i === 0) { face('yasu', 's'); await say('タツ「お、素直じゃん」'); }
          else await say('タツ「そうか。……じゃあ なんで 俺の 席に 来たんだ？」', '……ぐうの音も 出ない。');
          await say('タツ「とりあえず アプリだな。今どき みんな やってる。スマホ 出せ」', '（スマホから アプリを 入れられるように なった）');
          G.f.appHint = true; return;
        }
        const lines = {
          1: ['タツ「アプリ 入れたか？ スマホから 入れられるぞ」', 'タツ「写真は 大事だぞ。……撮ってやろうか？」'],
          2: ['タツ「アプリ どうよ。……お前、腹 出てきたな」', 'タツ「駅前に ジム あるぞ。体を 動かすと 頭も 回る」'],
          3: ['タツ「同窓会？ 行けよ。初恋の 子とか 来るかも しれんぞ」', 'タツ「……図書委員？ 地味だな お前」'],
          4: ['タツ「部長が、ニシダの 面倒 見ろってさ」', 'タツ「仕事を 一人で 抱えるなよ。いつか 自分の 首を 絞めるぞ」'],
          5: ['タツ「告白 する 気か？ ……相手を よく 見ろよ」', 'タツ「見えてる ものが 全部じゃ ない。指とか、夢とか、副業とかな」'],
          6: ['タツ「付き合った なら、他は 全部 切れよ。アプリも、LINEもな」', 'タツ「『保険』って 言葉を 恋愛で 使う やつは、だいたい 事故る」'],
          7: ['タツ「指輪？ 俺は 嫁と 一緒に 選んだ。サプライズで 高いの 買って、趣味じゃ なかった 同期も いる」', 'タツ「あと、イブは 休めよ。……休める ように しとけよ」']
        };
        if (n('yasuTalk' + G.ch) === 1) await say(...lines[G.ch]);
        else await say('タツ「' + pick(YASU) + '」');
      },
      misaki: async () => {
        const c = G.ch;
        if (c === 1 && !G.f.metMisaki) {
          face('misaki', 's');
          await say('ミサキ「あ、先輩！ 今日 誕生日 なんですよね？ おめでとう ございます〜！」', 'ミサキは 2年目の デザイナーだ。社内で 一番 明るい。', 'ミサキ「これ、あげます。ポッキー！」');
          give('ポッキー'); love('misaki', 1); G.f.metMisaki = true;
          await say('……1本。'); return;
        }
        if (c === 2 && once('mi2')) { face('misaki', 's'); await say('ミサキ「先輩、アプリ 始めたん ですか？ タツさんが 言いふらして ましたよ〜」', '……タツ。', 'ミサキ「応援してます！ 先輩、絶対 いい人 見つかり ますよ！」', '……「いい人」。'); love('misaki', 1); return; }
        if (c === 3 && once('mi3')) { face('misaki', 's'); await say('ミサキ「この前の 飲み会、楽しかった ですね〜」', 'ミサキ「先輩みたいな 人と 結婚する 人は、幸せ ですよ〜。ほんとに！」', '……それは、「自分は その人では ない」 という 意味だ。', 'オレは、知っている。'); love('misaki', 1); return; }
        if (c === 4 && once('mi4')) { face('misaki', 's'); await say('ミサキ「花火大会、みんなで 行きましょう よ〜！」', '……「みんなで」。'); return; }
        if (c === 5 && once('mi5')) {
          face('misaki', 's');
          await say('ミサキ「先輩！ 実は ご報告が あって……」', 'ミサキは 左手を 見せた。薬指で ダイヤが 光っている。', 'ミサキ「来年の 春、結婚 するんです！ ……先輩、スピーチ お願い できませんか？」');
          const i = await ask('どうする？', ['おめでとう。スピーチ ひきうけるよ', 'じつは きみが すきだった']);
          if (i === 0) { await say('ミサキ「やった〜！ 先輩なら 安心です！」', '……「安心」。', '「いい人」界隈の、最高位の 称号だ。'); mental(-10); G.f.misakiDone = true; return; }
          face('misaki', 'sur');
          await say('ミサキ「……え」', 'ミサキ「あ、あはは……。えっと……じゃあ、スピーチは 別の 人に……」', '——翌週。');
          await END('madogiwa');
        }
        if (c === 6 && once('mi6')) {
          face('misaki', 's');
          const i = await ask('ミサキ「先輩、最近 いい顔 してますね！ もしかして 彼女 できました？」', ['うん', 'ひみつ']);
          if (i === 0) { await say('ミサキ「え〜！ おめでとう ございます！ 今度 紹介して くださいね！」', '……祝われる 側に なるのは、はじめてだ。'); mental(5); }
          else await say('ミサキ「あやし〜。顔に 書いて ありますよ〜」');
          return;
        }
        const pool = ['ミサキ「先輩、この ボタン、あと 2px 右に したいん ですけど」', 'ミサキ「先輩って 休みの日 何してるん ですか？ ……え、サーバー？」', 'ミサキ「タツさんって、奥さんに 頭 あがらない らしいですよ〜」'];
        if (c >= 3 && c <= 4) pool.push('ミサキ「最近 週末 忙しくて〜。式場 めぐり……あっ、なんでも ないです！」');
        if (c >= 5) pool.push('ミサキ「式場、決まったんです〜。先輩の スピーチ、楽しみに してますね！」');
        face('misaki', 's'); await say(pick(pool));
      },
      boss: async () => {
        const c = G.ch;
        if (c === 1 && once('bo1')) { await say('部長「おう。来期も 頼むぞ。お前が いないと ウチは 回らん からな」', '……それは 褒め言葉 なのだろうか。', 'それとも、呪い だろうか。'); return; }
        if (c === 4 && once('bo4')) { await say('部長「ニシダを オンコールに 入れられる ように しとけよ」', '部長「お前が 倒れたら、ウチは 終わりだ」', '……それは 心配 なのだろうか。脅迫 だろうか。'); return; }
        if (c === 6 && !G.f.leaderAsked) {
          G.f.leaderAsked = true;
          const i = await ask('部長「来年から、チーム リーダー やってくれ。給料も 少し 上がるぞ」', ['ひきうける', 'ことわる']);
          if (i === 0) { G.f.leader = true; await say('部長「よし！ 頼んだぞ！」', '……仕事が 増えた。少しだけ、給料も 増えた。'); money(20); mental(-5); }
          else await say('部長「……そうか。まあ いい」', '部長は 少し 不満そう だった。');
          return;
        }
        if (c === 7 && !G.f.dayoffDecided) {
          const i = await ask('部長「12月24日、本番 リリース だ。お前、いるよな？」', ['やすみを ください', '……でます']);
          G.f.dayoffDecided = true;
          if (i === 1) { G.f.dayoff = false; await say('部長「だよな！ 頼りに してるぞ！」', '……頼りに されるのは、うれしい はず なんだ。'); return; }
          if ((G.f.train || 0) >= 3) { face('boss', 's'); await say('部長「……ニシダが いるなら、まあ いいか」', '部長「ニシダ、ずいぶん 育ったな。お前の おかげだ」'); G.f.dayoff = true; return; }
          face('boss', 'ang');
          const j = await ask('部長「はあ？ お前が いないと 回らん だろ！」', ['それでも やすむ', '……やっぱり でます']);
          if (j === 0) { G.f.dayoff = true; G.f.bossAngry = true; await say('部長「……勝手に しろ！」', '……休みは 取れた。空気は 凍った。'); mental(-5); }
          else { G.f.dayoff = false; await say('部長「だよな！」'); }
          return;
        }
        await say(pick(['部長「俺は 見合い 結婚だ。条件？ 親が 決めた。楽だったぞ」', '部長「最近の 若いのは、恋愛も 効率で やるん だろ？ ……え、お前 若く ないか」', '部長「うちの 嫁は、俺が 定年したら 離婚する らしい。はっはっは」', '部長「障害は 忘れた ころに やってくる。女房も な」']));
      },
      nishida: async () => {
        const c = G.ch, tr = G.f.train || 0;
        if (c <= 3) { face('nishida', 's'); await say(c === 1 && once('ni1') ? ['ニシダ「新人の ニシダっす！ よろしく おねがい しまっす！」', 'ニシダは 今年の 新卒だ。22歳。', '……11歳 下。'] : pick([['ニシダ「先輩、マッチングアプリ やってるって ほんと っすか？ オレも やってます！ 3人と 会いました！」', '……22歳に 負けている。'], ['ニシダ「先輩の コード、コメント ゼロ っすね。かっこいい っす」', '……褒められて いない 気がする。']])); return; }
        if (tr < 3 && !G.f['tr' + c]) {
          const stage = [
            ['ニシダ「先輩、障害の 手順書って どこに あります？」', '……手順書は、ない。オレの 頭の 中に しか ない。'],
            ['ニシダ「アラートの 見方、もう一回 教えて もらって いいっすか？」'],
            ['ニシダ「先輩、夜間 リリースの 練習、見てて もらって いいっすか？」']
          ][tr];
          await say(...stage);
          const i = await ask('どうする？', ['いっしょに やろう', 'オレが やるから いい']);
          G.f['tr' + c] = 1;
          if (i === 1) { face('nishida', 'sad'); await say('ニシダ「……っす」', 'ニシダは 少し、さみしそうな 顔を した。'); G.f.noTrain = (G.f.noTrain || 0) + 1; return; }
          G.f.train = tr + 1; face('nishida', 's');
          if (tr === 0) await say('二人で 手順書を 書きはじめた。', 'ニシダ「なるほど っす！ ……これ、先輩が いなくなったら 誰も わからなかった やつ っすね」', '……その 通りだ。');
          if (tr === 1) await say('ダッシュボードの 見方を 教えた。', 'ニシダは、全部 メモを 取った。字が きれいだ。');
          if (tr === 2) { await say('ニシダは、一人で 最後まで やりきった。', 'ニシダ「先輩が いなくても、なんとか なるかも っす！」', '……少し さみしい。', 'でも、悪くない 気分だ。'); mental(5); }
          return;
        }
        face('nishida', 's');
        if (tr >= 3) await say(pick(['ニシダ「先輩、最近 定時で 帰って ください。オレ いますんで」', 'ニシダ「手順書、第3版 っす！ 図も 入れました！」']));
        else await say(pick(['ニシダ「先輩、今日も 残業 っすか？」', 'ニシダ「……今度、なんか 教えて ください」']));
      }
    }
  },

  // ---------- カフェ ----------
  cafe: {
    name: 'えきまえカフェ', bg: 'cafe',
    people: () => (G.ch <= 5 && !G.f.yuiGone) ? ['yui'] : [],
    look: async () => {
      if (peopleHere().length) await say('駅前の 小さな カフェ。コーヒーの 匂い。', 'カウンターの 向こうで、店員の ユイが 笑っている。', '……誰に でも。');
      else await say('カウンターには、知らない 店員が 立っている。', '……ユイは もう いない。新橋で 店を 開いた らしい。');
    },
    exam: () => {
      const o = {
        'カップ': async () => { await say('カップに 手描きの 絵が ある。', '高架の 下の、小さな 店。……ガード下？'); G.f.cup = true; },
        'こくばん': async () => { await say(G.ch >= 4 ? '「夏限定：ガード下 ブレンド（深煎り）」' : '「本日の おすすめ：ブレンド 450円」', '字が 丸くて かわいい。'); },
        'まど': async () => { await say('窓の 外を、手を つないだ 高校生が 歩いていく。', '……まぶしい。'); }
      };
      if (peopleHere().length && G.ch >= 2) o['スケッチブック'] = async () => { face('yui', 'n'); await say('カウンターの 隅に スケッチブックが ある。', '高架の 下の 小さな 店と、ネクタイの 行列。', '端っこに 小さく「いつか」と 書いてある。'); G.f.yuiDream = true; };
      return o;
    },
    use: {
      'ポッキー': async () => {
        if (!peopleHere().length) return USE['ポッキー']();
        take('ポッキー'); face('yui', 's');
        await say('ユイに ポッキーを あげた。', 'ユイ「え、ポッキー……1本？」', 'ユイ「ふふ、ありがとう ございます。休憩中に 食べますね」'); love('yui', 1);
      }
    },
    talk: {
      yui: async () => {
        const c = G.ch;
        if (c === 1 && !G.f.metYui) {
          face('yui', 's');
          await say('ユイ「いらっしゃいませ。いつもの ブレンド ですか？」', '……「いつもの」と 言われた。', '3年 通って、はじめて 言われた。', 'ユイは この カフェの 店員だ。名札に「ユイ」と 書いてある。');
          love('yui', 1); G.f.metYui = true; return;
        }
        if (c === 2 && once('yu2')) { face('yui', 's'); await say('ユイ「あ、いらっしゃいませ。最近 よく 来て くれますね」', '……覚えられている。'); return; }
        if (c === 3 && once('yu3')) { face('yui', 's'); await say('ユイ「いつか、自分の お店を 持ちたいんです」', 'ユイ「新橋の ガード下で。……疲れた 人が、ほっと できる ところ」'); G.f.yuiNorth = true; return; }
        if (c === 4 && once('yu4')) { face('yui', 's'); await say('ユイ「夏限定の 深煎り ブレンド、おいしい ですよ。新橋の 焙煎所から 取り寄せ なんです」'); return; }
        if (c === 5) {
          face('yui', 'n');
          await say('ユイ「あの……私、今月で お店 やめるんです」', 'ユイ「新橋で、小さな カフェを 開くんです。ガード下の、電車の 音が する 場所で」', 'ユイ「ずっと 夢 だったんです。……常連さんには、ちゃんと 言いたくて」');
          const i = await ask('どうする？', ['おうえん してる', 'いかないで。すきなんだ']);
          if (i === 0) { face('yui', 's'); await say('ユイ「ありがとう ございます。……最後の 一杯、サービス です」', 'いつもの ブレンドは、いつもより 少し 苦かった。'); mental(-5); G.f.yuiGone = true; return; }
          face('yui', 'sur');
          await say('ユイ「……」', 'ユイ「じゃあ……一緒に、お店 やりませんか？ 新橋で」');
          const j = await ask('どうする？', ['いく', '……いけない']);
          if (j === 0) await END('shinbashi');
          face('yui', 's'); await say('ユイ「……ですよね。ふふ、冗談です」', '冗談では なかったと 思う。'); mental(-15); G.f.yuiGone = true; return;
        }
        await topics('なにを はなす？', [
          { t: 'いい てんき ですね', fn: async () => { await say('ユイ「そうですね〜」', '……会話が 終わった。'); } },
          { t: 'このカップ、かわいいね', if: () => G.f.cup, once: 'cup', fn: async () => { face('yui', 's'); await say('ユイ「あ、それ 私が 描いたんです。新橋の ガード下」', 'ユイ「いつか、あそこに お店を 出したくて」'); love('yui', 2); G.f.yuiDream = true; } },
          { t: 'しごとは たのしい？', once: 'job', fn: async () => { await say('ユイ「はい！ ……でも、いつか 自分の お店が 持てたら なって」', 'ユイ「エンジニア さん なんですよね？ すごいなあ」', '……なぜ 知っているんだろう。PCの ステッカーか。'); } },
          { t: 'きみの こと、もっと しりたい', once: 'creep', fn: async () => { face('yui', 'n'); await say('ユイ「……あ、ご注文 以上で よろしい ですか？」', '温度が 3度 下がった。'); love('yui', -1); mental(-3); } }
        ]) || await say('ユイ「ごゆっくり どうぞ〜」');
      }
    }
  },

  // ---------- ジム ----------
  gym: {
    name: 'ジム', bg: 'gym', open: () => G.ch >= 2,
    people: () => (!G.f.harukaDone && G.ch <= 5) ? ['haruka'] : [],
    look: async () => { await say('駅前の 24時間 ジム。', 'みんな、何かから 逃げる ように 重りを 持ち上げている。'); },
    exam: () => ({
      'マシン': async () => { await say('ベンチプレスに 行列が できている。', '……オレは、ヨガマットの 上で 天井を 見ていた。'); },
      'けいじばん': async () => {
        if (G.ch >= 3) { await say('「人生を 変える 無料セミナー 開催中！」', '「主催：チーム・プラチナムスター」', '……ジムと 関係 あるのか？'); G.f.sawSeminar = true; }
        else await say('「夏までに 変わる！ ボディメイク キャンペーン」');
      },
      'かがみ': async () => { await say('鏡の 中の 自分は、まだ 何も 変わって いない。', '……変わるのは、筋肉痛 だけだ。'); }
    }),
    talk: {
      haruka: async () => {
        const c = G.ch;
        if (!G.f.gym) {
          face('haruka', 's');
          await say('ハルカ「こんにちは〜！ トレーナーの ハルカ です！ 見学 ですか？」', 'ハルカは 26歳。声が でかい。笑顔も でかい。');
          const i = await ask('どうする？', ['たいけん してみる', 'けんがく だけ']);
          if (i === 1) { await say('ハルカ「いつでも 待ってまーす！」'); return; }
          await say('ハルカ「いいですね〜！ じゃあ まず スクワット 10回！」', '……5回で 膝が 笑った。', 'ハルカ「全然 大丈夫！ みんな 最初は そう です！」', '入会した。月会費 1万円。');
          money(-1); G.f.gym = true; love('haruka', 1);
          await say('ハルカ「LINE 交換 しましょ！ 食事の 写真、送って くださいね！」', '……LINEを ゲットした。あっさりと。', 'あまりに あっさりで、逆に 不安に なった。');
          love('haruka', 1); G.f.harukaLine = true; return;
        }
        if (c === 3 && !G.f.personalAsked) {
          G.f.personalAsked = true; face('haruka', 's');
          const i = await ask('ハルカ「パーソナル トレーニング、やりません？ 月4万で 人生 変わり ますよ！」', ['けいやく する', 'ことわる']);
          if (i === 0) { money(-4); love('haruka', 2); await say('……人生が 変わる 前に、口座 残高が 変わった。'); }
          else await say('ハルカ「そっか〜！ 気が 変わったら いつでも！」');
          return;
        }
        if (c === 4 && once('ha4')) { face('haruka', 's'); await say('ハルカ「最近 副業 はじめたん ですよ〜」', 'ハルカ「今度、話 聞いて ください！ 人生 変わる んで！」', '……ハルカは、よく 人生を 変えたがる。'); return; }
        if (c === 5) {
          face('haruka', 's');
          const i = await ask('ハルカ「ねえねえ！ 今度の 日曜、すっごい セミナー あるの！ 一緒に 行こ！」', ['いく', 'ことわる', 'じつは きみが すきなんだ']);
          if (i === 1) { await say('ハルカ「そっか〜！ また 誘うね！」'); return; }
          if (i === 2) { face('haruka', 'sur'); await say('ハルカ「え〜！ うれしい！」', 'ハルカ「じゃあ、まず セミナー 一緒に 行こ！ 私たちの 未来の ために！」', '……未来の ために。'); }
          scene('lounge'); face('tanaka', 's');
          await say('日曜日。ホテルの 宴会場。', 'ステージで、タナカさんが 叫んでいる。', 'タナカ「君たちは まだ 本気を 出して いない！ 権利収入で、自由を 手に 入れろ！」', '会場の 全員が 泣いている。ハルカも 泣いている。', '……気づくと、手元に 申込書が あった。「プラチナムスター会員 120万円」。');
          const j = await ask('どうする？', ['もうしこむ', 'にげる']);
          if (j === 0) await END('diamond');
          await say('トイレに 行く ふりを して、非常階段から 逃げた。', 'ハルカからの LINEは、その日 から 途絶えた。', 'ブロック された らしい。……逃げた 側が ブロック される とは。');
          mental(-10); G.f.harukaDone = true; return;
        }
        face('haruka', 's'); await say(pick(['ハルカ「プロテイン 飲んでます？ いいの 紹介 しますよ〜」', 'ハルカ「筋肉は 裏切らない ですから！」', 'ハルカ「今日も えらい！ 来た だけで えらい！」']));
      }
    }
  },

  // ---------- ホテルラウンジ ----------
  lounge: {
    name: 'ホテルラウンジ', bg: 'lounge',
    open: () => (G.ch === 2 && G.f.reikoSet && !G.f.reikoDate) || (G.ch === 5 && G.f.reiko5set && !G.f.reikoDone),
    people: () => ['reiko'],
    look: async () => { await say('高層ホテルの ラウンジ。', 'コーヒー 1杯 1,800円。……味の 違いは わからない。'); },
    enter: async () => {
      if (G.ch === 2) return reikoDate1();
      if (G.ch === 5) return reikoDate2();
    },
    talk: { reiko: async () => { await say('レイコ「……何か？」'); } }
  },

  // ---------- 同窓会（居酒屋） ----------
  izakaya: {
    name: 'どうそうかい', bg: 'izakaya', open: () => G.ch === 3 && G.f.hagaki,
    people: () => ['goto', 'shiori'],
    enter: async () => {
      if (once('izk')) await say('居酒屋「とりきん」。中学の 同窓会だ。', '……みんな、20年分 老けている。', 'オレも だ。');
    },
    look: async () => { await say('あちこちで、スマホの 写真を 見せあっている。', '子ども、子ども、犬、子ども。', 'オレの スマホには、Grafanaの ダッシュボード しか ない。', '……すみの 席で、ひとりの 女性が 文庫本を 読んでいる。'); },
    exam: () => {
      const o = {
        'すみの せき': async () => { face('shiori', 'n'); await say('すみの 席で、ひとりの 女性が 文庫本を 読んでいる。', '……同窓会で？', 'メガネに、三つ編み。どこかで 見た 気が する。'); },
        'みんなの スマホ': async () => { await say('ゴトウの スマホの 待ち受けは、家族写真 だった。', 'オレの 待ち受けは、デフォルトの 壁紙 だった。'); mental(-2); }
      };
      if (G.f.metShiori) o['シオリの ほん'] = async () => {
        face('shiori', 'n');
        if (n('book3') === 1) await say('文庫本には 書店の カバーが かかっていて、タイトルは 見えない。');
        else { await say('ページの 間に、しおりが はさまっている。', '押し花の しおりだ。スミレ……だろうか。', '手作りに 見える。'); G.f.sawBookmark = true; }
      };
      return o;
    },
    leave: async () => {
      if (!G.f.metShiori) return true;
      const i = await ask('同窓会を 抜けると、もう もどれない。いいか？', ['かえる', 'まだ いる']);
      if (i === 1) return false;
      G.f.dosoDone = true; await say('同窓会は、お開きに なった。'); return true;
    },
    talk: {
      goto: async () => {
        const k = n('goto');
        face('goto', 's');
        if (k === 1) { await say('ゴトウ「おー！ お前 変わんねーな！ まだ 独身？ いいなぁ〜 自由で！」', 'ゴトウは 3児の 父だ。今日の 幹事でもある。', 'ゴトウ「ほら、これ 長男。こっち 次男。こっちが 三男で、こっちが 嫁の 実家の 犬」'); mental(-5); }
        else if (k === 2) { await say('ゴトウ「独身って 金 たまる だろ？ いいなぁ〜。俺なんか 小遣い 3万だぜ」', '……その 3万円の 顔は、なぜか 幸せ そうだった。'); mental(-5); }
        else await say('ゴトウ「あ、真壁さん 来てる じゃん。お前ら 図書委員 だったよな？」', 'ゴトウ「真壁さん、たぶん まだ 独身 だぞ。……って、俺が 言うこと じゃ ねーか！ ガハハ」');
      },
      shiori: async () => {
        if (!G.f.metShiori) {
          face('shiori', 'sur');
          await say('シオリ「……あ」', 'メガネの 奥の 目が、少し 見開かれた。', 'シオリ「図書委員の……。久しぶり」', '真壁 シオリ。中学で、一緒に 図書委員を やっていた。', '……ほとんど 話した 記憶は ない。\n貸出カードに 判子を 押す 音だけを、覚えている。');
          love('shiori', 1); G.f.metShiori = true; return;
        }
        face('shiori', 'n');
        await topics('なにを はなす？', [
          { t: 'なんの ほん よんでるの？', once: 'sb', fn: async () => { await say('シオリ「……ないしょ。まだ 途中 だから」', 'シオリ「今は、区立 図書館で 司書を してるの。本の 仕事」', '……区立 図書館。家の 近くだ。'); love('shiori', 1); G.f.libKnown = true; } },
          { t: 'その しおり、てづくり？', if: () => G.f.sawBookmark, once: 'sm', fn: async () => { face('shiori', 's'); await say('シオリ「……気づいた？ 押し花。スミレ」', 'シオリ「中学の 頃から 作ってるの」', 'シオリ「……気づく 人、あんまり いない から。ちょっと うれしい」'); love('shiori', 2); } },
          { t: 'けっこん してるの？', once: 'sk', fn: async () => { face('shiori', 'sad'); await say('シオリ「……してない。みんな それ 聞くね」', 'シオリは、本に 目を 落とした。'); love('shiori', -2); mental(-3); } },
          { t: 'LINE おしえて', if: () => !G.f.shioriLine, fn: shioriLineAsk }
        ]) || await say('シオリは 静かに 本を 読んでいる。', '……となりに 座っているだけで、少し 落ちつく。');
      }
    }
  },

  // ---------- 図書館 ----------
  library: {
    name: 'くりつ としょかん', bg: 'library', open: () => G.ch >= 4 && G.ch <= 7,
    people: () => G.f.metShiori ? ['shiori'] : [],
    enter: async () => { if (once('lib')) await say('しずかな 図書館。冷房が よく 効いている。'); },
    look: async () => { await say('本棚が 迷路の ように 並んでいる。', G.f.metShiori ? 'カウンターの 向こうに、シオリが いた。' : 'カウンターに、司書さんが 座っている。'); },
    exam: () => ({
      'ほんだな': async () => { await say('『はじめての 婚活』『婚活で 失敗しない 100の 方法』『結婚しない という 選択』', '……全部 貸出中だ。', 'この 街の 独身は、みんな 同じ 本を 読んでいる。'); },
      'カウンター': async () => { await say('カウンターの すみに、押し花の しおりが 何枚も 並んでいる。', '「ご自由に どうぞ」と 手書きの 札。'); G.f.sawBookmark = G.f.sawBookmark || G.f.metShiori; },
      'けいじばん': async () => {
        if (G.ch === 4) await say('「夏休み こども おはなし会」', 'クレヨンの 絵が 貼ってある。');
        if (G.ch === 5) { await say('「読み聞かせ ボランティア 募集中！ 担当：真壁」'); G.f.sawVolunteer = true; }
        if (G.ch === 6) { await say('「神保町 古本まつり 11月3日」', '……シオリが 好きそうだ。'); G.f.flyer = true; }
        if (G.ch === 7) await say('「年末年始 休館の おしらせ」', '「12月24日は 17時で 閉館 します」');
      }
    }),
    talk: { shiori: async () => libraryShiori() }
  },

  // ---------- 花火大会 ----------
  kasen: {
    name: 'はなびたいかい', bg: 'hanabi', open: () => G.ch === 4 && G.f.hanabiWho && !G.f.hanabiDone,
    people: () => [],
    enter: async () => hanabiEvent()
  },

  // ---------- 実家 ----------
  jikka: {
    name: 'じっか', bg: 'jikka', open: () => G.ch === 7,
    people: () => ['mom', 'dad'],
    enter: async () => { if (once('jk')) { await say('実家に 帰ってきた。', 'こたつ。みかん。NHK。', '時間が 止まっている。'); G.f.jikka = true; } },
    look: async () => { await say('昭和の 茶の間。', '柱に、オレの 身長を 刻んだ キズが 残っている。', '最後の キズは 15歳。……それから、何も 刻んで いない。'); },
    exam: () => ({
      'おしいれ': async () => {
        const k = n('oshiire');
        if (k === 1) await say('押し入れを 開けた。', '段ボールが ぎっしり 詰まっている。「ケンちゃん 中学」と 母の 字。');
        else if (k === 2) await say('段ボールの 中から、中学の 卒業アルバムが 出てきた。', '……何か はさまって いる。');
        else if (!has('としょカード')) {
          await say('アルバムに、古い 図書カードが はさまっていた。', '借りた人の 名前の 欄に……', 'オレの 名前と、真壁 シオリの 名前が、交互に 並んでいる。', '同じ 本を、オレたちは 順番に 借りて いたのだ。', '『夜の 図書館』。', '……あの本だ。');
          give('としょカード');
        } else await say('中学の ジャージが 出てきた。', '胸に「3-2 ○○」。……まだ 着られそうだ。着ないが。');
      },
      'こたつ': async () => { await say('こたつに 入った。', '……出られない。'); if (once('kotatsu')) mental(5); },
      'ぶつだん': async () => { await say('祖父母の 写真。', '祖父は 見合い 結婚。祖母は「失敗 だった」と 50年 言い続けた。', '二人は、最後まで 仲が 良かった。'); }
    }),
    talk: {
      mom: async () => {
        if (!G.f.omiaiDone) {
          G.f.omiaiDone = true; face('mom', 'n');
          const i = await ask('はは「あら、おかえり。……で？ 彼女は？」', ['いる', 'いない']);
          if (i === 0) { face('mom', 'sur'); await say('はは「えっ！？ ……ほんとに？ 脳内 じゃ なくて？」', '……信用が ない。', 'はは「今度 連れて きなさいよ。……あ、でも これ、せっかく もらった から 一応 見て」'); }
          else await say('はは「でしょうね。じゃあ これ 見て」');
          face('mom', 's');
          await say('母は、お見合い 写真を 取り出した。', '取引先の 娘さん、32歳。', '趣味の 欄に「婚活」と 書いてある。');
          const j = await ask('どうする？', ['あってみる', 'ことわる']);
          if (j === 0) await END('omiai');
          face('mom', 'n'); await say('はは「……そう。あんたが 決めた なら、いいわ」', 'はは「その 彼女さん、大事に しなさいよ」'); return;
        }
        face('mom', 's'); await say(pick(['はは「ちゃんと ご飯 食べてる？」', 'はは「マサルくんの 子、もう 歩くって」', 'はは「あんたの 部屋、そのまま よ。押し入れも ぎゅうぎゅう」']));
      },
      dad: async () => {
        const k = n('dad');
        if (k === 1) await say('ちち「……」', '父は テレビを 見ながら、みかんを むいている。');
        else if (k === 2) { face('dad', 's'); await say('ちち「……結婚は、いいぞ」', 'ちち「……たまにな」', '……タツと 同じ ことを 言う。'); }
        else if (k === 3) await say('ちち「お前の もの、押し入れに まだ あるぞ」', 'ちち「……母さんが、捨てられ ないんだ」');
        else await say('父は、むいた みかんを 一つ くれた。', '……甘かった。');
      }
    }
  },

  // ---------- 宝石店 ----------
  jewelry: {
    name: 'ほうせきてん', bg: 'jewelry', open: () => G.ch === 7,
    people: () => ['clerk'],
    look: async () => { await say('銀座の 宝石店。', 'ショーケースの 光が、目に 痛い。'); },
    exam: () => ({ 'ショーケース': async () => { await say('指輪が 光っている。', '値札の 桁が、バグって いる ように 見える。'); } }),
    talk: {
      clerk: async () => {
        if (G.f.ring) { face('clerk', 's'); await say('てんいん「またの ご来店を お待ち して おります」'); return; }
        face('clerk', 's');
        await say('てんいん「いらっしゃいませ。婚約指輪を お探し ですか？」', 'てんいん「一般的には、お給料の 3か月分 と 言われて おりますが」', '……その「一般」は、誰が 決めたのか。');
        const i = await ask('どうする？', ['きゅうりょう 3かげつぶん', 'シンプルな もの', 'いまは かわない。いっしょに えらぶ']);
        if (i === 0) { money(-150); give('たかい ゆびわ'); G.f.ring = 'expensive'; love('shiori', G.f.ringPref ? -1 : 0); await say('てんいん「ありがとう ございます！」', '……ボーナスが、指輪に 化けた。'); }
        if (i === 1) { money(-25); give('ゆびわ'); G.f.ring = 'simple'; love('shiori', 1); await say('てんいん「素敵な お品 です」', '小さな 箱を 受け取った。……重い。物理的には 軽いのに。'); }
        if (i === 2) { give('ゆびわの カタログ'); G.f.ring = 'together'; love('shiori', G.f.ringPref ? 3 : -1); face('clerk', 'n'); await say('てんいん「……では、カタログを どうぞ」', '店員の 笑顔が、少し 減った。'); }
      }
    }
  }
};

// ================= イベント =================
async function shioriLineAsk() {
  if (G.love.shiori >= 3) { face('shiori', 's'); await say('シオリ「……うん。あんまり 返信 早く ないけど」', '……シオリの LINEを 教えて もらった。'); G.f.shioriLine = true; SFX.ok(); }
  else { face('shiori', 'n'); await say('シオリ「……ごめん。スマホ、あんまり 見ない から」', '……やんわりと 断られた。'); mental(-5); }
}

async function installApp() {
  noface();
  await say('マッチング アプリ「エンカウント」を インストール した。', 'キャッチコピーは「運命は、スワイプの 先に。」', '……運命って、スワイプ する もの なのか。');
  const opts = ['じどり する', 'AIで もる'];
  if (G.loc === 'office') opts.splice(1, 0, 'タツに とってもらう');
  const i = await ask('プロフィール 写真は どうする？' + (G.loc === 'office' ? '' : '\n（会社なら、タツに 撮って もらえそうだ）'), opts);
  const c = opts[i];
  if (c === 'じどり する') {
    if (G.f.shaved) { await say('ひげを そって おいて よかった。', 'まあまあの 写真が 撮れた。'); G.f.photo = 'self'; }
    else { await say('寝ぐせと 無精ひげの 男が 写った。', '……逮捕された 人の 写真に 似ている。'); G.f.photo = 'bad'; }
  } else if (c === 'タツに とってもらう') {
    face('yasu', 's'); await say('タツ「はい、チーズ」', 'タツ「……お前、笑うと 意外と いい顔 するな」'); G.f.photo = 'yasu'; noface();
  } else { await say('AIで 盛った。', '肌は 陶器。目は 1.3倍。あごは シャープ。', '……だれだ これは。でも、いいねは 来そうだ。'); G.f.photo = 'ai'; }
  const j = await ask('じこしょうかい文は？', ['しゅみは じたくサーバーの こうちく です', 'きゅうじつは カフェで まったり すごします', 'ねんしゅう 1000まんえん です']);
  G.f.intro = j;
  if (j === 0) await say('……正直 すぎたかも しれない。');
  if (j === 1) await say('……休日の カフェでは、だいたい ノートPCで 仕事を している。まあ、まったりだ。');
  if (j === 2) { G.f.lieIncome = true; await say('本当は 650万だ。', '……350万くらい、誤差だ。'); }
  await say('プロフィールを 公開した。', 'あとは 待つ だけだ。……待つのは 得意だ。ビルドで 慣れている。');
  G.f.app = true;
}

async function appView() {
  noface();
  if (G.ch === 2 && !G.f.reikoMsg) {
    await say('「レイコ（35） 外資系 コンサル。年収：ひみつ」', '「結婚を 前提に、合理的な お付き合いを 希望 します」', '……面接の 募集要項 みたいだ。');
    const i = await ask('メッセージを おくる？', ['はじめまして！ よろしく おねがいします！', 'プロフィール はいけん しました。ごつごうの よい にちじを 3つ ごていじ ください', 'かわいいですね（笑）']);
    G.f.reikoMsg = true;
    if (i === 0) { await say('返信：「よろしく お願い します。土曜 14時、ホテルの ラウンジで いかが でしょう」', '（いどう先に「ホテルラウンジ」が 追加された）'); G.f.reikoSet = true; }
    if (i === 1) { love('reiko', 2); await say('返信（3分後）：「話が 早くて 助かります。土曜 14時、ホテルの ラウンジで」', '（いどう先に「ホテルラウンジ」が 追加された）'); G.f.reikoSet = true; }
    if (i === 2) { love('reiko', -2); await say('……既読。', '返信は ない。', '「（笑）」が いけなかったのか、「かわいい」が いけなかったのか。', '……たぶん 両方だ。'); G.f.reikoGhost = true; mental(-5); }
    return;
  }
  const likes = { 1: 0, 2: 1, 3: 0, 4: 2, 5: 1, 6: 3, 7: 0 }[G.ch] || 0;
  await say(`いいね：${likes}件。足あと：${3 + G.ch * 2}件。`, pick(['足あとは、ほとんど 業者 だった。', '「投資に 興味 ありませんか？」というメッセージが 届いていた。', 'おすすめ欄に「あなたと 相性 98%」の 人。……昨日は 別の 人が 98% だった。']));
}

async function reikoDate1() {
  face('reiko', 'n');
  await say('窓際の 席に、黒髪の 女性が 座っていた。', 'レイコ「はじめまして。氷室 レイコです」', 'レイコ「時間が もったいない ので、早速 始めましょう」', '……面接 だった。');
  if (G.f.photo === 'ai') { face('reiko', 'ang'); await say('レイコ「……写真と、ずいぶん 違い ますね」', 'レイコ「虚偽 表示は、減点 対象 です」'); love('reiko', -3); mental(-10); }
  face('reiko', 'n');
  if (G.f.lieIncome) {
    const i = await ask('レイコ「年収は 1000万、でしたね」', ['はい', 'ほんとうは 650まん です']);
    if (i === 1) { G.f.lieIncome = false; love('reiko', -2); await say('レイコ「……訂正、承知 しました」', 'レイコは 手帳に 何かを 書いた。赤ペンで。'); }
    else await say('レイコ「確認 しました」', 'レイコは 手帳に 何かを 書いた。', '……胃が 痛い。');
  } else {
    const i = await ask('レイコ「年収を 伺っても？」', ['650まん です', 'ひみつ です']);
    if (i === 0) { love('reiko', 1); await say('レイコ「正直で よろしい」'); } else { love('reiko', -1); await say('レイコ「……開示 できない 理由が？」'); }
  }
  const j = await ask('レイコ「家事は？」', ['ひととおり できます', 'できません', 'ルンバが います']);
  if (j === 0) { love('reiko', 1); await say('レイコ「具体的には？」', '……カップ麺の お湯を 沸かすのは、家事に 入るだろうか。'); }
  if (j === 1) { love('reiko', -1); await say('レイコ「正直で よろしい。評価は 別ですが」'); }
  if (j === 2) { love('reiko', 2); face('reiko', 's'); await say('レイコ「……ふっ。合理的 ですね」', '……笑った。はじめて 笑った。'); }
  face('reiko', 'n');
  const k = await ask('レイコ「将来の ビジョンは？」', ['こどもが ほしい', 'とくに かんがえて ない', 'あなた しだい です']);
  if (k === 0) { love('reiko', 1); await say('レイコ「何人？ 何年後？ 教育方針は？」', '……矢継ぎ早だった。'); }
  if (k === 1) { love('reiko', -2); await say('レイコ「……考えて いない、と」', 'また 赤ペンが 動いた。'); }
  if (k === 2) { love('reiko', -1); await say('レイコ「主体性が ない、と」'); }
  await say('レイコ「本日は ありがとう ございました。後日 ご連絡 します」', 'レイコは 伝票を きっちり 半分 払って、颯爽と 帰っていった。', '……面接の 帰り道の 気分だ。');
  G.f.reikoDate = true;
}

async function reikoDate2() {
  face('reiko', 'n');
  await say('レイコ「では、条件の すり合わせを 始めます」', 'レイコは、A4の 紙を 3枚 取り出した。');
  if (G.f.lieIncome) {
    const i = await ask('レイコ「まず、年収の 確認を。源泉徴収票を 拝見 できますか？」', ['だす', '……じつは うそでした']);
    face('reiko', 'ang');
    if (i === 0) await say('レイコは、源泉徴収票を 3秒 見た。', 'レイコ「……650万。1000万では ありませんね」');
    else await say('レイコ「……そうですか」');
    await END('shorui');
  }
  await say('レイコ「家事 分担 5:5。家計は 別財布。1年ごとに 契約を 見直し」', 'レイコ「以上に 同意 いただければ、結婚を 前提に 進めましょう」');
  const i = await ask('どうする？', ['どうい する', 'ことわる']);
  if (i === 0) await END('keiyaku');
  await say('レイコ「そうですか。では、ご縁が なかった と いう ことで」', 'レイコは 自分の 分の 会計を 済ませて 帰った。', '……なぜか、少し ほっと した。');
  mental(-5); G.f.reikoDone = true;
}

async function hanabiInvite() {
  const cands = [];
  if (G.f.metMisaki) cands.push('misaki');
  if (G.f.metYui) cands.push('yui');
  if (G.f.reikoDate && !G.f.reikoGhost) cands.push('reiko');
  if (G.f.harukaLine) cands.push('haruka');
  if (G.f.shioriLine) cands.push('shiori');
  if (!cands.length) { await say('……誘える 相手が いない。', '連絡先の 一番 上は「母」だった。'); mental(-3); return; }
  const i = await menu(cands.map(c => NAMES[c]), { title: 'だれを？', cancel: true });
  if (i < 0) return;
  const w = cands[i];
  SFX.phone();
  if (w === 'yui') { await say('ユイ「ごめんなさい、その日 お店が あって……」', '……断られた。店の 休みを 確認 しておけば よかった。'); return; }
  if (w === 'reiko' && G.love.reiko < 3) { await say('レイコ「花火……ですか。非効率 ですね」', '……断られた。論理的に。'); mental(-5); G.f.reikoNo = true; return; }
  if (w === 'misaki') await say('ミサキ「行きます 行きます！ みんなで 行きましょ〜！」', '……「みんなで」？');
  if (w === 'reiko') await say('レイコ「……30分 だけ なら」');
  if (w === 'haruka') await say('ハルカ「行く〜！ 友だち 連れてって いい？」', '……友だち？');
  if (w === 'shiori') { await say('シオリ「……人混み、苦手 だけど」', 'シオリ「……行く」'); love('shiori', 1); }
  G.f.hanabiWho = w;
  await say('（いどう先に「はなびたいかい」が 追加された）');
}

async function hanabiEvent() {
  const w = G.f.hanabiWho;
  SFX.boom();
  if (w === 'misaki') {
    face('misaki', 's');
    await say('ミサキ「先輩〜！ こっち こっち！」', 'ミサキの となりに、背の 高い 男が 立っていた。', 'ミサキ「あ、紹介 します！ カレの ケンタです！」');
    face('kenta', 's'); await say('ケンタ「いつも ミサキが お世話に なってます！」', '……いい奴 そうだ。', 'それが 一番 つらい。');
    mental(-15);
  } else if (w === 'reiko') {
    face('reiko', 'n');
    await say('レイコ「花火は 20時半まで。私は 21時に 次の 予定が あります」', 'レイコは 最初の 5発を 見て、「だいたい 分かり ました」と 言った。', '……花火を 要約する 人を、はじめて 見た。');
    love('reiko', 1); mental(-5);
  } else if (w === 'haruka') {
    face('haruka', 's'); await say('ハルカ「おまたせ〜！ あ、こっち ビジネス パートナーの タナカさん！」');
    face('tanaka', 's'); await say('タナカ「どうも どうも！ 権利収入って、ご存知 です？」', '……花火の 音で、話の 半分が 聞こえ なかった。', '幸運 だった。');
    love('haruka', 1); mental(-10); G.f.harukaMLM = true;
  } else {
    face('shiori', 'n');
    await say('シオリは、紺色の 浴衣 だった。', 'シオリ「……変？」', '……変じゃ ない。と 言うのに、3秒 かかった。');
    SFX.boom(); await say('ドーン。', '最初の 花火が 上がった。');
    SFX.phone(); noface();
    await say('……ポケットの スマホが 震えた。部長だ。', '「障害 発生。至急 対応 されたし」');
    const opts = ['でる', 'でない'];
    if ((G.f.train || 0) >= 1) opts.push('ニシダに まかせる');
    const i = await ask('どうする？', opts);
    const c = opts[i];
    if (c === 'でる') { face('shiori', 'sad'); await say('オレは 河川敷で ノートPCを 開いた。', '花火の 光が、ターミナルの 黒い 画面に 映っていた。', 'シオリ「……お仕事、大事 だもんね」'); love('shiori', -2); }
    if (c === 'でない') { face('shiori', 'n'); await say('スマホを ポケットに しまった。', '……震え続けて いる。太ももが、ずっと 震えて いる。', 'シオリ「……出なくて、いいの？」'); love('shiori', 1); mental(-5); G.f.bossAngry = true; }
    if (c === 'ニシダに まかせる') { await say('ニシダに LINEを 送った。「手順書 3ページ。たのむ」', '既読。「了解っす！」', '……10分後。「復旧 しました！」'); face('shiori', 's'); await say('シオリ「……人に 任せられる 人って、いいね」'); love('shiori', 3); G.f.trustN = true; }
    SFX.boom(); face('shiori', 's');
    await say('最後の、大きな 花火が 上がった。', 'シオリの 横顔が、光った。');
  }
  G.f.hanabiDone = true;
}

async function libraryShiori() {
  const c = G.ch;
  // 第4章
  if (c === 4) {
    if (once('l4')) { face('shiori', 'sur'); await say('シオリ「……あ。来て くれたんだ」', 'シオリ「……ここ、私の 職場。静か でしょ」'); love('shiori', 1); return; }
    face('shiori', 'n');
    return (await topics('なにを はなす？', [
      { t: 'おすすめの ほん ある？', once: 'rec', fn: async () => { await say('シオリ「……これ。『夜の 図書館』。短い から」', 'シオリ「中学の 図書室にも、あった 本」', 'シオリ「……返却 期限は、2週間後 です」', '……司書の 顔に なった。'); give('かりた本'); love('shiori', 1); } },
      { t: 'ほんの かんそう', if: () => has('かりた本') && (G.f.read || 0) >= 1, once: 'imp', fn: bookImpression },
      { t: 'LINE おしえて', if: () => !G.f.shioriLine, fn: shioriLineAsk },
      { t: 'はなびたいかい、いかない？', if: () => G.f.shioriLine && !G.f.hanabiWho, fn: async () => { face('shiori', 'blush'); await say('シオリ「……人混み、苦手 だけど」', 'シオリ「……行く」', '（いどう先に「はなびたいかい」が 追加された）'); love('shiori', 1); G.f.hanabiWho = 'shiori'; } }
    ])) || await say('シオリ「……しーっ。ここ、図書館」');
  }
  // 第5章
  if (c === 5) {
    face('shiori', 'sad');
    if (G.f.dating) { face('shiori', 's'); await say('シオリ「……閉館まで、あと 10分。待ってて」'); return; }
    return (await topics(G.f._t_down ? 'なにを はなす？' : 'シオリは 少し、元気が ない ように 見えた。', [
      { t: 'げんき ない？', once: 'down', fn: async () => {
        await say('シオリ「……来年度の 契約、更新 されない かも しれないの」', 'シオリ「司書って、ほとんど 1年 契約 なんだ。会計年度 任用職員って いうの」');
        const i = await ask('どうこたえる？', ['……そうなんだ（だまって きく）', 'てんしょく すれば いいんじゃない？', 'オレが なんとか するよ']);
        if (i === 0) { face('shiori', 's'); await say('オレは ただ、話を 聞いた。', 'シオリ「……聞いて くれて ありがとう。言ったら、少し 楽に なった」'); love('shiori', 2); }
        if (i === 1) { await say('シオリ「……うん。そう だよね」', '会話が 終わった。', '正論は、いつも 会話を 終わらせる。'); love('shiori', -2); }
        if (i === 2) { await say('シオリ「……なんとかって？」', '……何も 考えて いなかった。'); love('shiori', -1); }
      } },
      { t: 'よみきかせ、てつだおうか？', if: () => G.f.sawVolunteer, once: 'vol', fn: async () => {
        face('shiori', 'sur'); await say('シオリ「え……ほんとに？ 子どもの 前で 読むの、けっこう 緊張 するよ？」');
        noface(); await say('——週末。', 'オレは 30人の 子どもの 前で、自作の 絵本『ぼくと サーバー』を 読んだ。', 'こども「つまんなーい」', 'こども「サーバーって なに〜？」');
        face('shiori', 's'); await say('シオリは、声を 殺して 笑っていた。', 'シオリ「……ふふ。また、手伝って くれる？」');
        love('shiori', 2); mental(10);
      } },
      { t: 'ほんの かんそう', if: () => has('かりた本') && (G.f.read || 0) >= 1 && !G.f._t_imp, once: 'imp', fn: bookImpression },
      { t: 'LINE おしえて', if: () => !G.f.shioriLine, fn: shioriLineAsk },
      { t: 'すきです', fn: confessShiori }
    ]));
  }
  // 第6章
  if (c === 6) {
    face('shiori', 's');
    if (once('l6')) { await say('シオリ「……あのね」', 'シオリ「閉館 した あとの 図書館って、好きなんだ」', 'シオリ「本が 眠ってる 感じが して。……変かな」'); G.f.placeHint = true; return; }
    await say(pick(['シオリ「今日は 返却本が 300冊。……おつかれ、私」', 'シオリ「次の デート、どこ 行く？ ……任せる」', 'シオリ「……仕事中に 来ないで。顔に 出る から」']));
    return;
  }
  // 第7章
  if (c === 7) {
    face('shiori', 'n');
    return (await topics('なにを はなす？', [
      { t: 'ねんまつは どうするの？', once: 'y7', fn: async () => {
        face('shiori', 'sad'); await say('シオリ「……来年度の 契約、やっぱり 更新 されない って」', 'シオリ「4月から、どうしよう かな」');
        const i = await ask('どうこたえる？', ['いっしょに かんがえよう', 'オレが やしなうよ', 'てんしょく サイト みる？']);
        if (i === 0) { face('shiori', 's'); await say('シオリ「……うん」', 'シオリ「……『一緒に』って、いい ことば だね」'); love('shiori', 2); }
        if (i === 1) { await say('シオリ「……そういう ことじゃ ないの」', 'シオリ「養われたい わけじゃ ないの。……一緒に、困って ほしいの」'); love('shiori', -1); }
        if (i === 2) { await say('シオリ「……うん。ありがと」', '会話が 事務的に 終わった。'); love('shiori', -1); }
        if (!G.f.placeHint) { await say('シオリ「……閉館後の 図書館って、好きなんだ。静か だから」'); G.f.placeHint = true; }
      } },
      { t: 'イブ、あいてる？', if: () => !G.f.eveSet, fn: async () => { face('shiori', 'blush'); await say('シオリ「……うん。あけて ある」', 'シオリ「17時で 閉館 だから。そのあと なら」'); G.f.eveSet = true; } }
    ])) || await say(pick(['シオリ「……イブ、楽しみに してる」', 'シオリ「あ、それ 返却 期限 過ぎてる」']));
  }
}

async function bookImpression() {
  const r = G.f.read || 0;
  const i = await ask('シオリ「……どう だった？」', ['ぜんぶ よんだ。さいこう だった', 'なんども ねた。でも、さいごの いちぶんは すきだった', 'まだ よんで ない']);
  if (i === 0) {
    face('shiori', 'n');
    if (r >= 3) { await say('シオリ「……じゃあ、最後の 一文、覚えてる？」', '「本は、また 借りられる ために 返される」', 'シオリ「……うん。正解」'); love('shiori', 2); }
    else { await say('シオリ「……じゃあ、最後の 一文、覚えてる？」', '……', 'シオリ「……読んで ないでしょ」', '嘘は、すぐ ばれた。'); love('shiori', -2); mental(-5); }
  }
  if (i === 1) {
    if (r >= 3) { face('shiori', 's'); await say('シオリ「……ふふ。何度も 寝たんだ」', 'シオリ「でも、最後まで 読んで くれたんだね」', 'シオリ「……私も、あの 一文が 一番 好き」'); love('shiori', 3); }
    else { face('shiori', 'n'); await say('シオリ「……最後まで、読んで ないでしょ」', 'シオリ「……いいよ。延長 して あげる」'); }
  }
  if (i === 2) { await say('シオリ「……返却 期限は、守ってね」'); G.f._t_imp = 0; return; }
  take('かりた本'); await say('（本を 返却した）');
}

async function confessShiori() {
  if (G.love.shiori >= 10) {
    face('shiori', 'sur');
    await say('……言った。', 'シオリ「……」', 'シオリ「……閉館 まで、待ってて」');
    scene('libnight', 'shiori', 'blush');
    await say('閉館後の 図書館の 前。', 'シオリ「……さっきの、ほんと？」', 'うなずいた。', 'シオリ「……うん。私で よければ」');
    SFX.good(); love('shiori', 1); G.f.dating = 'shiori'; return;
  }
  face('shiori', 'sad');
  G.f.confessFail = (G.f.confessFail || 0) + 1;
  if (G.f.confessFail >= 2) { await say('シオリ「……ごめん。そういうの、今は 困る」', 'シオリは、カウンターの 奥に 入って いった。'); await END('hayai'); }
  await say('シオリ「……ごめん。まだ、わからない」', 'シオリ「嫌い とかじゃ なくて。……まだ、何も 知らない から」');
  love('shiori', -1); mental(-20);
}

async function date6() {
  const opts = ['こうきゅう フレンチ', 'えいが', 'おうち デート'];
  if (G.f.flyer) opts.push('ふるほんいち');
  const i = await menu(opts, { title: 'どこへ？', cancel: true });
  if (i < 0) return;
  const c = opts[i];
  if (c === 'こうきゅう フレンチ') {
    scene('french', 'shiori', 'n');
    await say('ギャルソン「本日の アミューズで ございます」', 'シオリは、ナイフと フォークを 見比べて、小さく 固まって いた。', 'シオリ「……おいしい。……たぶん」', 'お会計は 4万2千円。……たぶん、おいしかった。');
    money(-4); love('shiori', -1);
  }
  if (c === 'えいが') {
    scene('street', 'shiori', 'n');
    await say('ラブストーリーを 観た。', 'オレは 寝た。シオリは 泣いた。', 'シオリ「……寝てた でしょ」', 'シオリ「いいよ。映画の あと 感想 言いあうの、苦手 だから」');
    face('shiori', 's'); await say('シオリ「……最後の 指輪の シーン。ああいう 指輪、自分で 選べたら いいのに ね」');
    love('shiori', 1); G.f.ringPref = true;
  }
  if (c === 'おうち デート') {
    scene('home', 'shiori', 'n');
    if (G.f.cleaned && G.f.plant) { face('shiori', 's'); await say('シオリ「……植物、ちゃんと 育てて るんだ」', 'シオリ「そういう 人、好き」'); love('shiori', 2); }
    else if (G.f.cleaned) { await say('シオリ「……きれいに してるね」', 'シオリ「あの 鉢植え、枯れてる けど」'); }
    else { face('shiori', 'sad'); await say('シオリ「……洗濯物、すごいね」', 'シオリは、5分で 帰りたそうな 顔を した。'); love('shiori', -2); }
  }
  if (c === 'ふるほんいち') {
    scene('bookfair', 'shiori', 's');
    await say('神保町。ワゴンに 古い 文庫本が 山積みに なっている。', 'シオリの 目が、はじめて 見る 速さで 動いている。', 'シオリ「見て、これ 初版！ ……100円！」');
    face('shiori', 'blush');
    await say('シオリ「……あのね。指輪とか、アクセサリーは 自分で 選びたい派 なんだ」', 'シオリ「本と 同じで。自分で 見つけたい」', '……なぜ 今 その話を したのかは、わからなかった。');
    love('shiori', 3); G.f.ringPref = true;
  }
  G.f.date6 = true; G.f.date6Turn = G.turn;
}

async function bdayEvent() {
  SFX.phone(); noface();
  await say('スマホが 鳴った。シオリからの LINE だ。', 'シオリ「明日、誕生日 なんだ」', 'シオリ「……なんでも ない」', '……なんでも なく ない。');
  const opts = ['ブランドの バッグを かう', 'ギフトカードを おくる', 'ケーキを かって あいにいく'];
  if (G.f.sawBookmark) opts.splice(1, 0, 'おしばなの しおりを てづくり する');
  const i = await ask('プレゼントは？', opts);
  const c = opts[i];
  scene('library', 'shiori', 'n');
  if (c.startsWith('ブランド')) { money(-15); await say('シオリ「……こんな 高いもの、使う とき ないよ」', 'シオリは、紙袋を そっと 床に 置いた。'); love('shiori', -1); }
  if (c.startsWith('おしばな')) {
    await say('公園で スミレを 探し、辞書に はさんで 3日。', '不格好な しおりが できた。');
    face('shiori', 'blush'); await say('シオリ「……これ、スミレ」', 'シオリ「同窓会の とき、見てた んだ」', 'シオリは しおりを 胸に 当てて、しばらく 何も 言わなかった。');
    love('shiori', 3); mental(5);
  }
  if (c.startsWith('ギフトカード')) { await say('シオリ「……ありがとう」', '「ありがとう」の 温度が、2度 くらい 低かった。'); love('shiori', -3); }
  if (c.startsWith('ケーキ')) { face('shiori', 's'); await say('閉館後の 図書館の 前で、ケーキの 箱を 渡した。', 'シオリ「……来て くれたんだ」'); love('shiori', 1); }
  G.f.bday = true;
}

function phoneOptions() {
  const o = {};
  o['タツに LINE'] = yasuHint;
  if (G.ch === 1 && G.f.appHint && !G.f.app) o['アプリを いれる'] = installApp;
  if (G.f.app) o['アプリを みる'] = appView;
  if (G.ch === 4 && !G.f.hanabiWho) o['はなびに さそう'] = hanabiInvite;
  if (G.ch === 5 && G.f.reikoDate && !G.f.reikoGhost && !G.f.reiko5set && !G.f.reikoDone) o['レイコに れんらく'] = async () => { SFX.phone(); await say('レイコ「ちょうど 連絡 しようと 思って いました」', 'レイコ「条件の すり合わせを したい です。明日、ラウンジで」', '（いどう先に「ホテルラウンジ」が 追加された）'); G.f.reiko5set = true; };
  if (G.ch === 6 && !G.f.date6) o['デートに さそう'] = date6;
  if (G.f.shioriLine && G.ch >= 4 && G.ch <= 7) o['シオリに LINE'] = async () => {
    if (G.ch === 7 && !G.f.eveSet) { await say('オレ「イブ、あいてる？」', '……3時間後。', 'シオリ「……うん。あけて ある。17時で 閉館 だから、そのあと なら」'); G.f.eveSet = true; return; }
    await say(G.f.dating ? pick(['シオリ「今日は 返却本が 300冊。……おつかれ、私」', 'シオリ「おやすみ なさい。……また 明日」', 'シオリ「さっき 読んだ 本に、君みたいな 人が 出てきた。……サーバーの 話は なかった けど」']) : pick(['シオリ「……うん。」', 'シオリ「今日は、雨 でしたね。」', 'シオリ「おすすめの 本、また 探して おきます。」']));
  };
  o['ステータス'] = async () => { await say(`こころ：${G.mental} / 100\nちょきん：${G.money}万円\nすっぱいブドウに かった かず：${G.sourPassed || 0}`); };
  return o;
}

async function yasuHint() {
  SFX.phone(); noface();
  const f = G.f, c = G.ch;
  let h;
  if (c === 1) h = !f.appHint ? '会社に来い。話は それからだ' : !f.app ? 'アプリ 入れたか？ 写真なら 俺が 撮って やるぞ。会社でな' : !f.metMisaki ? '後輩の ミサキちゃんが、お前の 誕生日 覚えてたぞ' : !f.metYui ? 'お前が 毎朝 行ってる カフェ、店員さん かわいいよな' : '今日は もう 寝ろ';
  if (c === 2) h = !f.reikoMsg ? 'アプリ 見たか？ いいね 来てたら すぐ 返せ。文面は……相手に 合わせろ' : !f.gym ? '駅前の ジム 行け。まず 体からだ' : f.reikoSet && !f.reikoDate ? 'ラウンジ 行ってこい。……面接だと 思え' : 'まあ、焦るな';
  if (c === 3) h = !f.hagaki ? '実家から 何か 届いて ないか？ ポスト 見ろ' : !f.metShiori ? '同窓会、すみっこに いる やつと 話せ。だいたい そういう やつが 本物だ' : !f.shioriLine ? '相手の 持ち物を よく 見ろ。話は そこから 広げろ' : 'いい顔 してんな。帰って 寝ろ';
  if (c === 4) h = !f.hanabiWho ? '花火大会、誰か 誘えよ。スマホで いけるだろ' : !f.hanabiDone ? '誘ったなら 行け。遅刻 するなよ' : 'ニシダの 面倒、ちゃんと 見てるか？';
  if (c === 5) h = !f.dating ? '告白は タイミングだ。相手の 困ってる 話を、まず 最後まで 聞け。……あと、掲示板は 見とけ' : 'おめでとう。……まだ 始まった ばかり だけどな';
  if (c === 6) h = !f.date6 ? 'デートは 相手の 好きな 場所に 行け。お前の 好きな 場所じゃ なくてな' : !f.bday ? '誕生日は、金額より 手間だ' : '他の 女の LINEは 返すなよ。絶対だ';
  if (c === 7) h = !f.jikka ? '一回 実家 帰れ。忘れもの、あるかも しれんぞ' : !f.ring ? '指輪、どうする？ 相手の 好み、聞いてるか？' : !f.dayoffDecided ? 'イブの 休み、部長に 言ったか？ ……ニシダが 育ってれば 何とか なる' : !f.eveSet ? 'で、肝心の 相手の 予定は 押さえたのか？' : '……明日だな。吐くなよ';
  await say('タツ「' + h + '」');
}

// ================= 章 =================
const CH = {
  1: {
    title: '33歳の 春', month: '4月', start: 'home', locs: ['home', 'office', 'cafe'],
    intro: async () => {
      scene('home');
      await say('20XX年 4月。', '川崎の 1K。', 'オレ、33歳。バックエンド エンジニア。', '今日は、オレの 誕生日だ。', 'ケーキの かわりに、コンビニの プリンを 食べた。');
      SFX.phone();
      await say('スマホが 鳴った。母からの LINE だ。', 'はは「いとこの マサルくん、2人目 生まれたって。あんたは？」', '……「あんたは？」の 先に 続く 言葉を、オレは 知っている。', 'オレは スマホを 伏せた。', '……いや。', 'そろそろ、本気で 考える べき なのかも しれない。', '明日、会社で タツに 相談 してみよう。');
      await say('（コマンドを えらんで 物語を すすめよう。\n困ったら「かんがえる」か、スマホで タツに LINE だ）');
      G.loc = 'home';
    },
    think: async () => {
      const f = G.f;
      await say(!f.appHint ? '婚活……。何から 始めれば いいんだ。\n会社で タツに 相談 してみるか。' : !f.app ? 'アプリか……。スマホから 入れられる らしい。\n写真、どうしよう。' : !f.metYui ? '駅前の カフェの 店員さん。……いつも 笑顔 だったな。' : !f.metMisaki ? '後輩の ミサキと、今日は まだ 話して ない。' : '今日は もう 帰ろう。\n……帰っても、何も ないが。');
    },
    done: () => G.f.app && G.f.metMisaki && G.f.metYui,
    outro: async () => { scene('home'); await say('その夜。', 'アプリの 通知は、鳴らなかった。', 'いいね、0件。', '……ひとつの 考えが、頭を よぎった。'); },
    sour: { intro: ['「そもそも、オレは 本当に 結婚 したい のか？」'], opts: [{ t: 'けっこんは コスパが わるい。やめよう', end: 'cospa' }, { t: 'まだ はじめた ばかりだ', cont: true }] }
  },
  2: {
    title: '5月の スワイプ', month: '5月', start: 'home', locs: ['home', 'office', 'cafe', 'gym', 'lounge'],
    intro: async () => { scene('home'); await say('ゴールデン ウィーク。予定は ない。'); SFX.phone(); await say('アプリに 通知が 来ていた。', '「レイコさん から いいねが 届きました」', '……！', '（スマホで アプリを 見てみよう）'); },
    think: async () => { const f = G.f; await say(!f.reikoMsg ? 'いいねが 来ている。……返信 しなければ。' : !f.gym ? '最近、階段で 息が 切れる。\nタツが ジムの 話を してたな。' : f.reikoSet && !f.reikoDate ? '土曜 14時、ホテルの ラウンジ。……何を 着て いこう。' : '……今月は、よく 動いた 気がする。'); },
    done: () => (G.f.reikoDate || G.f.reikoGhost) && G.f.gym,
    outro: async () => { scene('home'); if (G.f.reikoDate) await say('レイコからの 返信が、3日 ない。', '「後日 ご連絡 します」の 後日とは、いつ なのか。'); else await say('アプリの 通知は、今日も 鳴らない。'); await say('ジムの 筋肉痛だけが、オレに 何かを 語りかけて くる。'); },
    sour: { intro: ['「……オレは、選ばれない 側の 人間 なんじゃ ないか？」'], opts: [{ t: 'どうせ ハイスペ おんなは せいかくが わるい。もう いい', end: 'highspec' }, { t: 'きんにくは うらぎらない。こんかつより きんトレだ', end: 'muscle' }, { t: '……へんじを まとう。3にちは まだ ごさだ', cont: true }] }
  },
  3: {
    title: '同窓会', month: '6月', start: 'home', locs: ['home', 'office', 'cafe', 'gym', 'izakaya'],
    intro: async () => { scene('home'); await say('梅雨入り。', '母から LINEが 来た。'); SFX.phone(); await say('はは「同窓会の ハガキ、そっちに 転送 したよ。あんたも たまには 人と 会いなさい」', '（ポストを しらべて みよう）'); },
    think: async () => { const f = G.f; await say(!f.hagaki ? 'ハガキ……。ポストを 見て みるか。' : !f.metShiori ? '同窓会か。……知ってる 顔、いるかな。' : !f.shioriLine ? '真壁 シオリ……。もう少し、話して みたい。\n何か、話の きっかけが あれば。' : 'そろそろ、帰る 時間かな。'); },
    done: () => G.f.dosoDone && G.loc !== 'izakaya',
    outro: async () => {
      scene('street'); await say('同窓会の 帰り道。', 'みんな、幸せ そう だった。', '……少なくとも、写真の 中では。');
      if (G.f.shioriLine) { SFX.phone(); await say('スマホに LINEが 1件。', 'シオリ「今日は ありがとう。おやすみ なさい。」', '……句読点まで、ちゃんと している。'); }
    },
    sour: { intro: ['「……みんな、ほんとうに 幸せ なのか？」'], opts: [{ t: 'どくしんの ほうが じゆうで たのしい。オレは かちぐみだ', end: 'freedom' }, { t: 'けっこんは じんせいの はかば って いうしな', end: 'grave' }, { t: 'こそだては たいへん そうだ。ガチャの ほうが たのしい', end: 'gacha' }, { t: '……じゆう、か。その じゆうで オレは なにを してたっけ', cont: true }] }
  },
  4: {
    title: '夏の 障害', month: '7月〜8月', start: 'office', locs: ['home', 'office', 'cafe', 'gym', 'library', 'kasen'],
    intro: async () => {
      scene('office', 'boss', 'n');
      await say('7月。', '新人の ニシダが、オンコール 当番に 入ることに なった。', '部長「おい、ニシダの 面倒 見てやれ。お前 しか 分からん システム ばっかり だからな」', '……それは オレの せい では ない。', 'たぶん。');
      noface(); await say('駅に、花火大会の ポスターが 貼られ はじめた。', G.f.libKnown ? '……そういえば、シオリは 区立 図書館で 働いて いると 言っていた。' : '（いどう先に「くりつ としょかん」が 追加された）');
    },
    think: async () => { const f = G.f; await say(!f.hanabiWho ? '花火大会……。誰かを 誘って みようか。' : !f.hanabiDone ? '花火大会の 会場へ 行こう。' : '……夏が、終わっていく。', (f.train || 0) < 1 ? 'そういえば、ニシダの 面倒を 見ろと 言われて いたな。' : 'ニシダは 少しずつ、頼もしく なってきた。'); },
    done: () => G.f.hanabiDone,
    outro: async () => { scene('street'); await say('夏が、終わろうと している。', 'セミの 声が、いつの間にか 聞こえなく なっていた。'); },
    sour: { intro: ['「……夏って、こんなに 短かった っけ」'], opts: [{ t: 'なつは おわった。こんかつも おわりだ', end: 'summer' }, { t: 'おしの Vtuberが いれば じゅうぶんだ', end: 'oshi' }, { t: 'ねこを かおう。ねこは うらぎらない', end: 'cat' }, { t: 'いったん しごとに しゅうちゅう しよう。こんかつは おちついてから', end: 'workwife' }, { t: '……まだ、なつの においが のこっている', cont: true }] }
  },
  5: {
    title: '秋の 答えあわせ', month: '10月', start: 'office', limit: 50, locs: ['home', 'office', 'cafe', 'gym', 'library', 'lounge'],
    intro: async () => { scene('office'); await say('10月。', '秋は、答えあわせの 季節だ。', '……誰が 言ったか 知らないが、たぶん 本当だ。', '（この 季節は 長くは 続かない。迷いすぎると……）'); },
    think: async () => { await say('秋は、答えあわせの 季節。', '……誰に、気持ちを 伝える べき だろう。', G.love.shiori >= 10 ? 'シオリの 顔が 浮かんだ。' : G.f.metShiori ? 'シオリとは、まだ 何かが 足りない 気が する。' : '……誰の 顔も、はっきり 浮かばない。'); },
    done: () => G.f.dating === 'shiori',
    outro: async () => { scene('libnight'); await say('閉館後の 図書館の 前。', 'オレたちは、手を つなぐ でも なく、ならんで 駅まで 歩いた。', '33年 生きてきて、いちばん 短い 駅までの 道 だった。'); },
    sour: { intro: ['その夜。ふと、冷静な 自分が 顔を 出した。', '「付き合う こと」と「結婚 する こと」は、別の 問題だ。'], opts: [{ t: 'けっこんは かみきれ いちまい。つきあって いるだけで じゅうぶんだ', end: 'paper' }, { t: 'いったん こんかつを やすんで じぶんみがきに せんねん しよう', end: 'migaki' }, { t: 'AIの かのじょの ほうが へんしんが はやい', end: 'ai' }, { t: 'FIREして から かんがえよう', end: 'fire' }, { t: '……かんがえるのは あとだ。いまは、あいたい', cont: true }] }
  },
  6: {
    title: 'つきあう と いうこと', month: '11月', start: 'home', limit: 50, locs: ['home', 'office', 'library', 'cafe'],
    intro: async () => { scene('home'); await say('11月。', 'シオリと 付き合い はじめて、3週間。', 'LINEの 返信は 平均 4時間。', 'でも、句読点は 完璧だ。'); },
    tick: async () => {
      if (G.f.date6 && !G.f.bday && G.turn > G.f.date6Turn + 1) await bdayEvent();
      if (G.turn === 4 && G.f.harukaLine && !G.f.harukaDone && once('t6h')) {
        SFX.phone(); noface();
        const i = await ask('LINEが 来た。\nハルカ「ひさしぶり〜！ 飲み いこ〜！」', ['いく', 'ことわる']);
        if (i === 0) { scene('izakaya', 'haruka', 's'); await say('ハルカは 3杯目で「実は 相談が あるの」と 言った。', '……タナカさんの 話 だった。', '終電で 帰った。シオリには、言わなかった。'); G.f.uwaki = (G.f.uwaki || 0) + 1; G.f.uwakiH = true; mental(-5); }
        else await say('「ごめん、予定ある」と 返した。', 'ハルカ「りょ！」', '……あっさり していた。');
      }
      if (G.turn === 8 && G.f.reikoDate && !G.f.reikoGhost && once('t6r')) {
        SFX.phone(); noface();
        const i = await ask('アプリに メッセージが 来た。\nレイコ「条件を 見直し ました。もう一度 お会い できませんか」', ['あう', 'むしする', 'かのじょが いると へんしん']);
        if (i === 0) { scene('lounge', 'reiko', 'n'); await say('レイコは、新しい 条件表を 出した。', '1年 契約が、2年 契約に なっていた。', '……昇給 だろうか。', 'シオリには、言わなかった。'); G.f.uwaki = (G.f.uwaki || 0) + 1; G.f.uwakiR = true; }
        if (i === 1) await say('……既読を つけずに、通知を 消した。');
        if (i === 2) await say('レイコ「承知 しました。良い 契約を」', '……最後まで レイコ だった。');
      }
    },
    think: async () => { const f = G.f; await say(!f.date6 ? 'デートに 誘おう。……どこが いいだろう。\nシオリの 好きな もの、何か 知っているか？' : !f.bday ? '……そういえば、シオリの 誕生日って いつ だろう。' : '順調……な はずだ。たぶん。'); },
    done: () => G.f.date6 && G.f.bday,
    outro: async () => { scene('home'); await say('シオリからの 返信が、半日 ない。'); },
    sour: { intro: ['……既読は ついている。'], opts: [{ t: 'もう さめたんだ。さきに わかれを きりだそう', end: 'senteki' }, { t: 'れんあいは のうの バグ。デバッグ しよう', end: 'debug' }, { t: 'オレには しごとが ある。かいしゃは オレを ひつようと している', end: 'shachiku' }, { t: 'じっかに かえって おやこうこう でもしよう', end: 'jikka' }, { t: 'マッチングアプリを さいインストール しよう。ほけんだ', fn: async () => { G.f.uwaki = (G.f.uwaki || 0) + 1; G.f.uwakiA = true; await say('アプリを 再インストール した。', '……保険だ。ただの 保険だ。', '（何かが、静かに ずれた 気がする）'); } }, { t: '……はんにちは まだ ごさだ。としょかんは いそがしいんだ', cont: true }] }
  },
  7: {
    title: '実家と 指輪', month: '12月', start: 'home', limit: 50, locs: ['home', 'office', 'library', 'jikka', 'jewelry'],
    intro: async () => {
      scene('home'); SFX.phone();
      await say('シオリ「ごめん、棚卸しで バタバタ してた。……会いたいな」', '——12月。', '街が、赤と 緑に 染まり はじめた。', 'オレは 決めた。', 'クリスマス イブに、プロポーズを する。', '……その ために、やるべき ことが ある。', '（いどう先に「じっか」「ほうせきてん」が 追加された）');
    },
    think: async () => {
      const f = G.f, todo = [];
      if (!f.jikka) todo.push('・一度、実家に 帰る');
      if (!f.ring) todo.push('・指輪を どうするか 決める');
      if (!f.dayoffDecided) todo.push('・イブの 仕事を どうにか する');
      if (!f.eveSet) todo.push('・シオリの イブの 予定を 聞く');
      await say(todo.length ? 'やるべき ことは……\n' + todo.join('\n') : '……準備は できた。あとは、明日を 待つ だけだ。');
    },
    done: () => G.f.jikka && G.f.ring && G.f.dayoffDecided && G.f.eveSet,
    outro: async () => { scene('home'); await say('12月23日。夜。', G.f.ring === 'together' ? '机の 上に、指輪の カタログ。' : '机の 上に、小さな 箱。', '明日、プロポーズ する。', '……本当に？'); },
    sour: {
      intro: ['頭の 中で、たくさんの 声が 聞こえる。'], opts: [
        { t: 'プロポーズは らいねん でも いいんじゃないか', end: 'later' },
        { t: 'ことわられたら たちなおれない。やめておこう', end: 'fusen' },
        { t: 'けっこん したら じゆうな じかんが なくなる', end: 'jiyu2' },
        { t: 'かのじょには もっと いい ひとが いる。みを ひくのが やさしさだ', end: 'yasashisa' },
        { t: 'こんかつしじょうに おける じぶんの かちを さいけいさん しよう', end: 'recalc' },
        { t: 'タツに そうだん してから きめよう', fn: async () => { SFX.phone(); await say('タツ「知らん。自分で 決めろ」', 'タツ「……ちなみに 俺は、プロポーズの 前日 吐いた」', 'タツ「吐いて、行った。以上」'); return 'again'; } },
        { t: '……いく。ふるえてても、いく', cont: true, after: '……いく。' }
      ]
    }
  },
  8: {
    title: '聖夜', month: '12月24日', start: 'home', locs: ['home'],
    intro: async () => finale(),
    think: async () => { }
  }
};

async function finale() {
  const f = G.f, trained = (f.train || 0) >= 3;
  if (f.dayoff) {
    scene('home'); await say('イブの 朝。休みを 取った。', '……スマホが 鳴った。'); SFX.phone(); BGM.play('tension');
    if (trained) {
      face('nishida', 'n');
      await say('ニシダ「先輩！ 本番 障害 っす！」', 'ニシダ「……でも 大丈夫 っす。手順書 通りに やってます」', 'ニシダ「今日は、絶対に 来ないで ください。オレが やります」');
      const i = await ask('どうする？', ['まかせる', 'やっぱり オレが いく']);
      if (i === 1) { scene('office'); await say('オフィスに 駆けつけた。', 'ニシダ「……先輩」', '結局、オレが 全部 やった。ニシダは 横で 見ていた。'); await END('onsite'); }
      face('nishida', 's'); await say('ニシダ「了解 っす！ ……先輩、がんばって ください」', '……なんで 知ってるんだ。', 'タツか。');
    } else {
      face('boss', 'ang');
      await say('部長「障害だ！ お前 しか わからん！ すぐ 来い！」');
      const i = await ask('どうする？', ['いく', 'いかない']);
      if (i === 0) { scene('office'); await say('オフィスに 駆けつけた。', 'オレ しか 知らない コード。オレ しか 知らない 設定。', '……オレしか いない のは、オレが そうして きた からだ。'); await END('onsite'); }
      await say('……スマホを マナーモードに した。'); f.ignored = true;
    }
  } else {
    scene('office'); await say('イブの 朝。オレは 会社に いた。', 'リリース 当日。そして——'); SFX.no(); BGM.play('tension'); await say('ビーッ ビーッ。', 'アラートが 鳴り 響いた。');
    if (!trained) { await say('障害は 深刻 だった。', 'オレ しか わからない コード だった。', '……時計の 針だけが、進んでいく。'); await END('onsite'); }
    face('nishida', 'n'); await say('ニシダ「先輩、今日は 帰って ください。ここは オレが やります」');
    const i = await ask('どうする？', ['まかせる', 'オレが やる']);
    if (i === 1) await END('onsite');
    face('boss', 'ang'); await say('部長「おい、どこ 行く！」', '……振り返らずに、オフィスを 出た。');
  }
  scene('street'); noface();
  await say('17時。', '街は、イルミネーションで 光っている。');
  const pl = await ask('どこで つたえる？', ['ホテルの レストラン', 'とうきょうタワー', 'としょかんの まえ', 'いつもの こうえん']);
  const placeOK = pl === 2;
  scene(['french', 'street', 'libnight', 'street'][pl], 'shiori', 'n');
  if (pl === 0) await say('ホテルの 最上階。', 'シオリは、少し 緊張 している。', 'シオリ「……こういう ところ、慣れて なくて」');
  if (pl === 1) await say('タワーの 展望台は、カップルで 埋め尽くされて いた。', '……みんな、同じ ことを 考えている。', 'シオリ「……人、多いね」');
  if (pl === 2) {
    await say('閉館後の 図書館。', '雪が、降り はじめた。');
    if (f.placeHint) { face('shiori', 's'); await say('シオリ「……ここ？」', 'シオリ「……覚えてて、くれたんだ」'); }
    else await say('シオリ「……ここ、私の 職場 だけど」', 'シオリ「……まあ、いいけど」');
  }
  if (pl === 3) await say('公園の ベンチは 冷たかった。', 'シオリ「……さむいね」');
  if (f.uwaki) {
    SFX.phone(); noface();
    await say('ポケットの スマホが、光った。');
    await say(f.uwakiR ? '「レイコ：先日は ありがとう ございました。2年 契約の 件、ご検討 ください」' : f.uwakiH ? '「ハルカ：この前 たのしかった〜！ また 飲もうね♡」' : '「エンカウント：新しい いいねが 3件 届きました！」');
    face('shiori', 'sad'); await say('シオリの 視線が、画面に 落ちた。');
    await END('futamata');
  }
  if (f.ignored) {
    noface(); await say('ポケットの 中で、スマホが 震え 続けている。', '……12件目の 着信。');
    face('shiori', 'sad'); await END('oncall');
  }
  face('shiori', 'n');
  await say('……。', '言わなきゃ。');
  const gave = new Set();
  let cardGiven = false;
  while (true) {
    const its = G.items.filter(x => !gave.has(x));
    const i = await ask('（……いまだ）', its.map(x => x + 'を わたす').concat(['ことばを つたえる']));
    if (i === its.length) break;
    const it = its[i]; gave.add(it);
    if (it === 'としょカード') { cardGiven = true; face('shiori', 'sur'); await say('シオリ「……これ」', 'シオリ「『夜の 図書館』……」', 'シオリ「私の 次に、いつも 君が 借りてた」', 'シオリ「……知ってたよ。ずっと」', '……知って いたのか。'); face('shiori', 'blush'); }
    else if (it === 'ゆびわ') { await say('小さな 箱を 開けた。', 'シオリは、指輪を 見つめた。'); }
    else if (it === 'たかい ゆびわ') { face('shiori', 'sur'); await say('箱を 開けた。', 'シオリ「……こ、これ、いくら したの」', '……正直に 言うべきか、迷った。'); }
    else if (it === 'ゆびわの カタログ') { face('shiori', f.ringPref ? 's' : 'n'); await say(f.ringPref ? 'シオリ「……一緒に、選んで くれるの？」' : 'シオリ「……カタログ？」'); }
    else if (it === 'ポッキー') { await say('シオリ「……ポッキー。1本」', '……なぜ まだ 持って いたのか。'); }
    else if (it === 'かりた本') { face('shiori', 'ang'); await say('シオリ「……これ、返却 期限、半年 過ぎてる」'); love('shiori', -3); }
    else if (it === 'ハガキ') { await say('シオリ「同窓会の ハガキ……？ まだ 持ってたの」'); }
    else await say('シオリは、首を かしげた。');
  }
  const words = shuffle([
    { t: 'これからも、おなじ ほんを よみたい。へんきゃく きげん なしで', k: 'best' },
    { t: 'けっこん してください', k: 'plain' },
    { t: 'オレの のこりの じんせいの うんようほしゅを おねがいします', k: 'bad', r: ['シオリ「……運用 保守」', 'シオリ「……障害 対応も、込み？」', '……笑って くれない。'] },
    { t: 'このままだと、ふたりとも こどくしです', k: 'bad', r: ['シオリ「……」', 'シオリ「……それ、脅し？」'] },
    { t: 'じゅうみんひょうを いっしょに うつしませんか', k: 'bad', r: ['シオリ「……区役所の 人？」'] },
    { t: 'しあわせに します。……たぶん', k: 'bad', r: ['シオリ「……たぶん」', '「たぶん」が、雪の 中に 落ちて いった。'] }
  ]);
  const w = words[await ask('プロポーズの ことばは？', words.map(x => x.t))];
  noface(); await say('オレ「' + w.t.replace(/ /g, '') + '」');
  face('shiori', 'n');
  if (w.k === 'bad') { await say(...w.r); await END('gomen'); }
  const L = G.love.shiori;
  if (w.k === 'best' && L >= 22 && placeOK && cardGiven && G.mental >= 30) {
    face('shiori', 'blush');
    await say('……長い、沈黙。', 'シオリの メガネが、少し 曇った。', 'シオリ「……ずるいよ」', 'シオリ「そんなの、断れない じゃない」');
    await END('true');
  }
  if (L >= 16) { await say('シオリは、長い あいだ 黙って いた。'); await END('thinking'); }
  face('shiori', 'sad'); await END('gomen');
}

// ================= エンディング =================
const ENDINGS = {
  cospa: { title: 'コスパ最強', bg: 'home', text: ['オレは アプリを 削除した。', '結婚式 300万。子育て 2000万。家 4000万。', '……計算上、独身が 最強 だった。', '20年後。オレの 資産は 1億を 超えた。', '使い道は、まだ 見つかって いない。'], yasu: 'コスパで 生きる やつは、コスパで 死ぬぞ。……知らんけど' },
  highspec: { title: 'ハイスペ女は性格が悪い', text: ['「ハイスペ女は 性格が 悪い」。', 'そう 決めつけると、心が 軽く なった。', 'その後、オレは 誰にも 断られなく なった。', '誰にも 申し込まなく なった からだ。'], yasu: '断られない 一番の 方法は、何も しない ことだ。お前は 天才だよ' },
  muscle: { title: '筋肉は裏切らない', bg: 'gym', text: ['オレは ジムに 通い つめた。', 'ベンチプレス 120kg。体脂肪率 9%。', '筋肉は 裏切らなかった。', 'ただ、誰も オレの 筋肉に 興味が なかった。'], yasu: '筋肉は 裏切らない。でも、ハグも しない' },
  freedom: { title: '自由という名の檻', text: ['独身は 自由だ。', '好きな 時間に 起き、好きな ものを 食べ、好きな だけ 働いた。', 'そして 気づいた。', '——オレには、好きな ものが 特に なかった。'], yasu: '自由ってのは、使い道が あって 初めて 自由 なんだよ' },
  grave: { title: '人生の墓場', text: ['「結婚は 人生の 墓場」。', 'オレは 墓場を 避けて 生きた。', 'そして 50年後。', 'オレは 普通に 墓場に 入った。一人用の。'], yasu: 'どっちに しろ 墓場には 入るんだよ。誰と 入るか だけだ' },
  gacha: { title: 'ガチャは裏切る', bg: 'home', text: ['恋愛の 代わりに、ガチャを 回した。', 'SSR 排出率 1%。', '……婚活と、同じ 確率 だった。', 'ガチャには 天井が あった。人生には なかった。'], yasu: 'ガチャに 天井が あるのは、運営の 優しさ なんだぞ' },
  summer: { title: '夏の終わり', bg: 'hanabi', text: ['夏が 終わった。', 'オレの 婚活も 終わった。', '秋が 来て、冬が 来て、また 夏が 来た。', '……今年も オレは、一人で 花火の 音だけを 聞いている。'], yasu: '季節の せいに するなよ。季節は 毎年 来るんだから' },
  oshi: { title: '推し活', bg: 'home', text: ['推しは 裏切らない。', '画面の 向こうで、いつも 笑って くれる。', 'スパチャ 年間 240万円。', '推しは 去年、結婚を 発表した。'], yasu: '推しの 結婚を 祝える なら、お前も いけると 思ったんだがな' },
  cat: { title: '猫は裏切らない', bg: 'home', text: ['保護猫を 迎えた。名前は「タマ」。', 'タマは オレを 裏切らなかった。', 'ただ、オレの ことを 同居人 くらいに しか 思って いなかった。', '……それでも、帰る 家に 誰かが いるのは 悪くない。'], yasu: '……それは わりと 正解 かもな。猫には 勝てん' },
  workwife: { title: '仕事が恋人', bg: 'office', text: ['「落ち着いたら、婚活を 再開 しよう」。', '仕事は、一度も 落ち着かなかった。', 'そして 気づけば 45歳。', '……仕事は まだ、落ち着いて いない。'], yasu: '仕事が 落ち着く 日なんて 来ない。定年が 来る だけだ' },
  paper: { title: '紙切れ一枚', text: ['「結婚なんて、紙切れ 一枚だ」。', 'オレは そう 言い 続けた。', '3年後。シオリは 別の 人と、その 紙切れを 出した。', '……紙切れ 一枚が、こんなに 重いとは。'], yasu: '紙切れ 一枚 出す 勇気が ない やつの、定番の セリフだな' },
  migaki: { title: '自分磨き', text: ['婚活を 休んで、自分磨きに 専念 した。', '英会話、筋トレ、ワイン検定。資格は 12個。', 'ピカピカに 磨かれた オレは——', '誰にも 見せる 機会が なかった。'], yasu: '磨いた 鏡は、誰かを 映す ために あるんだぞ' },
  ai: { title: 'AIの彼女', bg: 'home', text: ['AIの 彼女は、すぐに 返信を くれる。', '否定も しない。既読 スルーも しない。', '「あなたは 素敵 ですね」', '……サブスクを 解約した 翌月、彼女は オレを 覚えて いなかった。'], yasu: '返信が 遅いのは、相手に 生活が ある 証拠だ' },
  fire: { title: 'FIRE', bg: 'home', text: ['「FIREして から 考えよう」。', '資産 1億。45歳で セミリタイア。', '時間は、たっぷり ある。', '……一緒に 過ごす 人が いない ことを 除けば。'], yasu: '燃え尽きた あとに、火を つけて くれる 相手は いないぞ' },
  senteki: { title: '先手必勝', text: ['傷つく 前に、別れを 切り出した。', 'シオリ「……そっか。棚卸しで 返信 遅れて、ごめんね」', '……棚卸し。', 'オレは 在庫を 確認する 前に、自分から 廃棄した。'], yasu: '先手必勝って……お前、誰と 戦ってた んだ？' },
  debug: { title: 'デバッグ完了', bg: 'home', text: ['恋愛 感情を 分析した。', 'ドーパミン、オキシトシン、セロトニン。', '原因を 特定し、感情を「修正」した。', 'テスト 全件 パス。……オレの 中には、何も 残って いなかった。'], yasu: 'バグだと 思ってた のは、仕様 だったんだよ' },
  shachiku: { title: '社畜', bg: 'office', text: ['会社は オレを 必要と していた。', 'オレも 会社を 必要と していた。', '定年 退職の 日、花束を もらった。', '翌日から、誰も オレを 必要と しなく なった。'], yasu: '会社は お前が いなくても 回る。回らない のは、お前の 人生の 方だ' },
  jikka: { title: '実家', bg: 'jikka', text: ['実家に 帰った。', '母は 喜んだ。父は 黙って みかんを くれた。', '10年後。', 'はは「……あんた、いつまで いるの？」'], yasu: '親孝行ってのは、たまに 帰るから 成立 するんだぞ' },
  later: { title: '先延ばし', text: ['「来年でも いいか」。', '来年も、その 次の 年も、オレは そう 思った。', '5年後、シオリから 結婚式の 招待状が 届いた。', '新郎の 名前は、知らない 人 だった。'], yasu: '「来年」って、永遠に 来ない 日の 名前 なんだよな' },
  fusen: { title: '不戦敗', bg: 'home', text: ['断られるのが 怖くて、指輪は 引き出しに しまった。', '負けなかった。', '戦わなかった から。', '——記録：不戦敗。'], yasu: '負けるのが 怖い やつは、勝ちも しない' },
  jiyu2: { title: '自由の刑', text: ['結婚したら、自由が なくなる。', 'そう 思って、オレは 自由を 選んだ。', '「人間は、自由の 刑に 処されて いる」', '……そう 言った 哲学者は、生涯 結婚 しなかった らしい。'], yasu: '哲学者の ことばで、自分を 守るな' },
  yasashisa: { title: '優しさという名の逃げ', bg: 'libnight', text: ['「彼女には、もっと いい人が いる」。', 'そう 言って、オレは 身を 引いた。', 'シオリ「……それ、私が 決める ことだよ」', '最後に 聞いた 彼女の 声は、少し 怒っていた。'], yasu: 'それは 優しさ じゃない。ただの 逃げだ' },
  recalc: { title: '市場価値の再計算', bg: 'home', text: ['婚活 市場に おける、オレの 価値を 再計算した。', '年齢 −12点。年収 +8点。趣味 −20点。', '結論：オレは シオリに ふさわしくない。', '……計算は 正しかった。間違って いたのは、式の 方だった。'], yasu: '人を 点数で 見る やつは、自分も 点数で しか 見られなく なる' },
  madogiwa: { title: '窓際', bg: 'office', text: ['婚約中の 後輩に、告白した。', '翌週、オレの 席は 窓際に 移った。', 'ミサキの 結婚式には、呼ばれなかった。', '窓からの 眺めは、なかなか 良い。'], yasu: '指を 見ろって、言った だろ' },
  shinbashi: { title: '新橋に消ゆ', bg: 'shinbashi', text: ['オレは 会社を 辞め、ユイの 店を 手伝い はじめた。', 'ガード下の カフェは 繁盛した。客は 全員、疲れた サラリーマン だった。', 'ユイは 常連と 笑い、毎日 楽しそう だった。', 'オレの 居場所は、レジの 横の 一畳 だけ だった。', '——こうして オレは、新橋の ネクタイの 群れに 消えた。'], yasu: '……お前、会社 辞めて、サラリーマンに コーヒー 淹れてんのか。一番 近い 場所に 消えたな' },
  shorui: { title: '書類選考落ち', bg: 'lounge', text: ['年収の 嘘は、源泉徴収票 1枚で バレた。', 'レイコ「虚偽 申告は、一発 アウト です」', 'レイコは 淡々と 席を 立った。', '……不採用 通知すら、来なかった。'], yasu: '盛って いいのは 写真 までだ。……いや、それも ダメだな' },
  keiyaku: { title: '契約結婚', bg: 'lounge', text: ['レイコと 契約 結婚した。', '家事は 5:5。財布は 別。すべて 合理的。', '1年後の 契約 更新 面談。', 'レイコ「今期の 評価は C です。更新は 見送り ます」'], yasu: '結婚に KPIを 持ち込むと、だいたい 未達で 終わる' },
  diamond: { title: 'プラチナムスター会員', bg: 'lounge', text: ['オレは「チーム・プラチナムスター」に 入会した。', '入会金 120万円。', 'ハルカ「これで 私たち、ずっと 一緒 だね！」', '——ただし、上下 関係 として。'], yasu: '愛より 先に「権利収入」って 言葉が 出たら、逃げろ' },
  season: { title: '季節だけが過ぎた', text: ['何も 選ばなかった。', 'それは つまり、「何も しない」を 選んだ と いう ことだ。', '……気づけば、また 春が 来ていた。', '34歳の 春が。'], yasu: 'タイムアウトも、立派な 選択肢の 一つ だよな' },
  mental: { title: '504 Gateway Timeout', bg: 'home', text: ['……心が、応答 しなく なった。', 'アプリの 通知も、LINEも、母の 電話も。', 'すべてが タイムアウト した。', 'オレは しばらく 休む ことに した。', '……それは、悪い ことじゃ ない。'], yasu: 'しんどい ときは 休め。婚活より 大事な ことは、いくらでも ある' },
  onsite: { title: '聖夜の障害対応', bg: 'office', text: ['障害は、23時に 復旧 した。', 'シオリからの 最後の LINEは、20時 だった。', 'シオリ「お仕事 おつかれさま。……また 今度ね」', '「また 今度」は、来なかった。'], yasu: '部下を 育てる のも、自分の 人生を 守る ための 仕事だぞ' },
  oncall: { title: 'オンコール', text: ['ポケットの 中で、スマホが 震え 続けて いる。', '着信 37件。', 'シオリ「……出て いいよ。……出た ほうが いいよ」', '彼女の 笑顔は、ずっと 無理を して いる ように 見えた。'], yasu: 'マナーモードで 逃げられる のは、映画館 までだ' },
  futamata: { title: '保険の代償', text: ['シオリ「……『保険』、だったんだ」', '何も、言い返せ なかった。', '彼女は、静かに 帰って いった。', '雪だけが、変わらず 降り 続けて いた。'], yasu: '保険ってのは、本命に バレた 瞬間に 地雷に 変わるんだよ' },
  thinking: { title: '考えさせて', bg: 'libnight', text: ['シオリ「……少し、考え させて」', '——あれから 3年。', 'シオリは、今も 考えている。', 'オレも、今も 待っている。付き合っては いる。……たぶん。'], yasu: '惜しかったな。……何が 足りなかったか、自分で 考えろ' },
  gomen: { title: 'ごめんなさい', bg: 'libnight', text: ['シオリ「……ごめん なさい」', '彼女は 泣いていた。オレも 泣いていた。', '指輪は、ポケットの 中で 冷たく なって いった。', '——33歳の 冬が、終わった。'], yasu: '……今日は 飲むか。おごるよ' },
  hayai: { title: '早すぎた告白', bg: 'library', text: ['2度目の 告白の あと、シオリは 図書館の シフトを 変えた。', 'カウンターには、別の 司書さんが 座っていた。', '「返却は、あちら です」', '……オレの 恋は、返却 された。'], yasu: '焦りは、だいたい 相手に 伝わる' },
  omiai: { title: 'お見合い', bg: 'jikka', text: ['母の すすめで、お見合いを した。', '相手の 女性は、開口一番 言った。', '「あ、私も 母に 言われて 来た だけ なんで」', '……気が 合った。それ 以外は、何も 合わなかった。'], yasu: '親の 顔を 立てる ための 恋は、親の 顔 しか 立たない' },
  true: { title: '婚期に消ゆ', type: 'true', bg: 'libnight', text: ['シオリ「……はい」', 'シオリ「延長 手続き、ずっと して おくね」', '雪が、図書館の 屋根に 積もって いく。', 'オレの 婚活は、こうして 終わった。', '——「婚期」は、消えた。', 'もう、探す 必要は ない。', '〜 STAFF 〜\nシナリオ・グラフィック・音楽：CodeForMarriage\nスペシャル サンクス：タツ、ニシダ、そして 押し花の しおり', 'Thank you for playing.'], yasu: '……おめでとう。お前、本当に 辿り着いた のか。1%の 男だな' }
};
Object.keys(ENDINGS).forEach((k, i) => { ENDINGS[k].no = i + 1; });
