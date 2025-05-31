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

## 3. 環境変数ファイルの作成

- バックエンド用: `backend/.env`
- フロントエンド用: `frontend/.env`

必要なAPIキーや設定値をそれぞれ記載してください。

---

## 4. 開発環境の作成手順

1. 必要なツール（Docker, Docker Compose, Git）がインストールされていることを確認します。
2. プロジェクトディレクトリに移動し、`.env` ファイルを `backend/` および `frontend/` に作成します。
3. 以下のコマンドでDockerコンテナをビルド・起動します。

```sh
docker-compose up --build
```

4. 起動後、以下のURLで各サービスにアクセスできます。
   - フロントエンド: [http://localhost:3000](http://localhost:3000)
   - バックエンド: [http://localhost:8000](http://localhost:8000)

---

## 5. Dockerコンテナの起動

```sh
docker-compose up --build
```

- 初回はイメージのビルドに数分かかります。
- バックエンド（FastAPI）は `localhost:8000`、フロントエンド（React）は `localhost:3000` でアクセス可能です。
- バックエンドは `/health` エンドポイントでヘルスチェックされます。

---

## 6. 開発用ホットリロード

- フロントエンド: `frontend/src` ディレクトリでコードを編集すると自動でリロードされます（`npm run dev`）。
- バックエンド: `backend/app` ディレクトリでコードを編集すると自動でリロードされます（`--reload` オプション）。

---

## 7. よくあるトラブル

- ポート競合エラーが出る場合は、既存のプロセスを停止してください。
- Docker Desktopのリソース割り当て（CPU/メモリ）が不足している場合は設定を見直してください。
- バックエンドの仮想環境は `/opt/venv` 配下に作成され、ボリュームマウントの影響を受けません。

---

## 8. その他

- 詳細な技術構成やAPI仕様は `docs/` ディレクトリ内の他ドキュメントを参照してください。
- 質問や不明点はIssueで報告してください。

---

## 9. テスト・Linterの実行

### バックエンド

- テスト実行（pytest）:
  ```sh
  docker-compose exec backend poetry run pytest
  ```
- Linter実行（ruff）:
  ```sh
  docker-compose exec backend poetry run ruff app/
  ```

### フロントエンド

- テスト実行（Jestなど）:
  ```sh
  docker-compose exec frontend npm test
  ```
- Linter実行（ESLint）:
  ```sh
  docker-compose exec frontend npm run lint
  ```

---

## 10. バックエンドAPIの起動・確認

- バックエンドは `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000` で起動
- `/health` エンドポイントで稼働確認
- 主要API:
    - `POST /upload` : 画像アップロード
    - `POST /generate` : イラスト生成
    - `GET /result/{id}` : 画像取得

---

## 11. APIリクエスト例

```sh
# 画像アップロード
curl -F "file=@test.png" http://localhost:8000/upload

# イラスト生成
curl -X POST -H "Content-Type: application/json" \
  -d '{"image_id": "xxxx", "style": "anime"}' \
  http://localhost:8000/generate

# 生成画像取得
curl http://localhost:8000/result/yyyy --output result.png
```

---

## 12. 自動デプロイ（Vercel/Render）

### フロントエンド（Vercel）

- `frontend/` ディレクトリは [Vercel](https://vercel.com/) に連携し、GitHubリポジトリへのpushで自動デプロイされます。
- Vercelのプロジェクト設定で、`root directory` を `frontend` に指定してください。
- 必要な環境変数（APIエンドポイントやFirebase設定など）はVercelの「Environment Variables」に設定してください。
- デプロイ後、Vercelの提供するURLでフロントエンドが公開されます。

### バックエンド（Render）

- `backend/` ディレクトリは [Render](https://render.com/) に連携し、GitHubリポジトリへのpushで自動デプロイされます。
- RenderのWeb Serviceとして新規作成し、`build command` や `start command` は通常通り（例: `poetry install` / `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`）。
- 必要な環境変数（APIキーやFirebaseプロジェクト情報など）はRenderの「Environment」設定で追加してください。
- デプロイ後、Renderの提供するURLでバックエンドAPIが公開されます。

---

## 13. デプロイ後の動作確認

- フロントエンドURL（Vercel）とバックエンドAPI URL（Render）をそれぞれ確認し、疎通・認証・画像生成ができることをチェックしてください。
- フロントエンドの `.env` にはバックエンドAPIのRender URLを指定してください。
