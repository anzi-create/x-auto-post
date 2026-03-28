require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");
const fs = require("fs");
const path = require("path");

// ── APIクライアント設定 ──────────────────────────
const client = new TwitterApi({
  appKey:            process.env.TWITTER_API_KEY,
  appSecret:         process.env.TWITTER_API_SECRET,
  accessToken:       process.env.TWITTER_ACCESS_TOKEN,
  accessSecret:      process.env.TWITTER_ACCESS_SECRET,
});

// ── 投稿候補を読み込む ──────────────────────────
const posts     = JSON.parse(fs.readFileSync(path.join(__dirname, "posts.json"), "utf-8"));
const statePath = path.join(__dirname, "state.json");

// 前回どこまで投稿したか記録
function loadState() {
  if (fs.existsSync(statePath)) return JSON.parse(fs.readFileSync(statePath, "utf-8"));
  return { lastIndex: -1 };
}
function saveState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

// ── URL埋め込み ──────────────────────────────────
function buildText(template) {
  return template
    .replace("{GAME_URL}", process.env.GAME_SITE_URL || "https://your-game-site.vercel.app")
    .replace("{BBQ_URL}",  process.env.BBQ_SITE_URL  || "https://your-bbq-site.vercel.app");
}

// ── メイン処理 ───────────────────────────────────
async function main() {
  const state     = loadState();
  const nextIndex = (state.lastIndex + 1) % posts.length;
  const post      = posts[nextIndex];
  const text      = buildText(post.text);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📤 投稿 [${nextIndex + 1}/${posts.length}]`);
  console.log(text);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    const tweet = await client.v2.tweet(text);
    console.log(`✅ 投稿成功！ tweet_id: ${tweet.data.id}`);
    saveState({ lastIndex: nextIndex, lastPostedAt: new Date().toISOString() });
  } catch (err) {
    console.error("❌ 投稿失敗:", err.message || err);
    process.exit(1);
  }
}

main();
