# 開発環境セットアップ手順

このドキュメントでは、本プロジェクトの開発環境をローカルに構築する手順を説明します。

---

## 1. 前提条件

- [Docker](https://www.docker.com/) および [Docker Compose](https://docs.docker.com/compose/) がインストール済みであること
- Gitがインストール済みであること

---

## 2. リポジトリのクローン

```sh
git clone <このリポジトリのURL>
cd aikon
```

---

## 3. 開発環境の作成手順

1. 必要なツール（Docker, Docker Compose, Git）がインストールされていることを確認します。
2. プロジェクトディレクトリに移動し、`.env` ファイルを作成します（APIキー等を記載）。
3. 以下のコマンドでDockerコンテナをビルド・起動します。

```sh
docker-compose up --build
```

4. 起動後、以下のURLで各サービスにアクセスできます。
   - フロントエンド: [http://localhost:3000](http://localhost:3000)
   - バックエンド: [http://localhost:8000](http://localhost:8000)

---

## 4. Dockerコンテナの起動

```sh
docker-compose up --build
```

- 初回はイメージのビルドに数分かかります。
- バックエンド（FastAPI）は `localhost:8000`、フロントエンド（React）は `localhost:3000` でアクセス可能です。

---

## 5. 開発用ホットリロード

- フロントエンド: `src/frontend` ディレクトリでコードを編集すると自動でリロードされます。
- バックエンド: `src/backend` ディレクトリでコードを編集すると自動でリロードされます。

---

## 6. よくあるトラブル

- ポート競合エラーが出る場合は、既存のプロセスを停止してください。
- Docker Desktopのリソース割り当て（CPU/メモリ）が不足している場合は設定を見直してください。

---

## 7. その他

- 詳細な技術構成やAPI仕様は `docs/` ディレクトリ内の他ドキュメントを参照してください。
- 質問や不明点はIssueで報告してください。
