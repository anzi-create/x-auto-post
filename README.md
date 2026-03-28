# X 自動投稿スクリプト

## セットアップ

1. `.env.example` をコピーして `.env` を作成
```
copy .env.example .env
```

2. `.env` にAPIキーを貼り付ける

3. `.env` のサイトURLを実際のVercel URLに変更する

## 使い方

### 手動で1回投稿
```
node post.js
```

### 投稿内容を変更
`posts.json` を編集して自由に追加・変更できます

## 自動投稿（スケジュール）
このスクリプトをCoworkのスケジュール機能で
定期実行できます
