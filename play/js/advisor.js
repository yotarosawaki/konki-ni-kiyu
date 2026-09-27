// ===== 婚活アドバイザーの診断（BAD END の あと に 出す）=====
'use strict';
// エンディングID → 原因カテゴリ
const ADVISOR_CAT = {
  // 言い訳で 婚活そのものを 降りた
  cospa: 'avoid', highspec: 'avoid', muscle: 'avoid', freedom: 'avoid', grave: 'avoid',
  gacha: 'avoid', summer: 'avoid', oshi: 'avoid', cat: 'avoid', paper: 'avoid',
  migaki: 'avoid', ai: 'avoid', fire: 'avoid', senteki: 'avoid', debug: 'avoid',
  jikka: 'avoid', jiyu2: 'avoid',
  // 仕事を 優先しすぎた
  workwife: 'work', shachiku: 'work', mental: 'work', onsite: 'work', oncall: 'work',
  // 誠実さ・対話が 足りなかった
  futamata: 'honesty', shorui: 'honesty', yasashisa: 'honesty', diamond: 'honesty',
  // 動く タイミングを 誤った・動けなかった
  later: 'timing', fusen: 'timing', madogiwa: 'timing', shinbashi: 'timing',
  season: 'timing', thinking: 'timing', hayai: 'timing', gomen: 'timing',
  // 相手も 自分も、条件で 見すぎた
  recalc: 'condition', keiyaku: 'condition', omiai: 'condition',
  // ネタ枠
  weatherBan: 'joke', weatherArrest: 'joke'
};
const ADVISOR_TEXT = {
  avoid: [
    'これは、よくある パターンです。',
    'うまく いかない ことへの 「もっともらしい 理由」を 先に 見つけて、婚活そのものを 降りて しまう。',
    '相談に 来る 男性の、およそ 半分が ここで つまずきます。理由が 正しいか どうかは、実は 関係ないんです。'
  ],
  work: [
    'お仕事、頑張って いますね。……頑張りすぎて いませんか？',
    '婚活を「落ち着いたら やる こと」に すると、優先順位は 一生 上がりません。落ち着く日は、来ないからです。',
    '婚活を、タスクの 1つとして スケジュールに 組み込む。それだけで、結果は 変わります。'
  ],
  honesty: [
    '小さな 隠し事や、正直に 言えなかった こと。心当たり、ありますよね。',
    '育成環境では 動いても、本番では 必ず 表に 出ます。恋愛も、システムと 同じです。',
    '最初から 正直に。相手を 信じられない うちは、相手からも 信じて もらえません。'
  ],
  timing: [
    '「まだ 早い」「もう 遅いかも」……そう思って いる うちに、機会は 過ぎて いきます。',
    '婚活には、ちょうど いい タイミングという ものが、実は ほとんど ありません。',
    '動くか、動かないか。迷っている 時間の 長さと、結果は、あまり 関係が ないんです。'
  ],
  condition: [
    '相手を スペック表で 見ていましたね。',
    '年収、条件、効率。……大事です。でも、それだけを 見ていると、相手からも 同じように 見られます。',
    'お互いを 数字で 見あう 関係は、数字が 崩れた 瞬間に 終わります。'
  ],
  joke: [
    '……これは、私の 専門を 超えています。',
    '天気の 話は、1日に 3回まで。それ以上は、世間話ではなく、事案です。',
    '次は、相手の 話も 聞いて あげて くださいね。'
  ]
};
function advisorLines(id) {
  const cat = ADVISOR_CAT[id];
  return cat ? ADVISOR_TEXT[cat] : null;
}
