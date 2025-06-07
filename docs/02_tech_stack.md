# 技術構成

## 技術スタック

| 領域         | 技術・バージョン                                                |
|--------------|---------------------------------------------------------|
| フロントエンド | React 18.x, Tailwind CSS 4.x, Node.js 22.x, npm         |
| バックエンド   | FastAPI 0.110.x, Python 3.12.x                          |
| 依存管理      | uv（バックエンド）, npm（フロントエンド）                                |
| 推論エンジン   | Replicate API（Stable Diffusion, ControlNet, InstantID等） |
| コンテナ      | Docker 24.x, docker-compose 2.x                         |
| 開発環境      | PyCharm, Docker interpreter（dev.Dockerfile利用）           |
| バックエンドテスト | pytest                                                  |
| バックエンドLinter | ruff                                                    |
| フロントエンドテスト | Jest                                                    |
| フロントエンドLinter | ESLint                                                  |
| 認証         | Firebase Authentication（Googleアカウント等）                   |
| デプロイ      | **GCP Cloud Storage（フロントエンド）, Cloud Run（バックエンド）**       |

## フロントエンド構成

- ディレクトリ: `frontend/`
- 主要ファイル:  
  - `package.json`（React, Tailwind, 開発用スクリプト等を管理）
  - `src/`（Reactコンポーネント、エントリポイント）
  - `public/`（HTMLテンプレート等）
  - `.env`（フロントエンド用環境変数）

## フロントエンド実装補足

- テスト: Jest によるユニットテスト
- Linter: ESLint による静的解析
- `npm test` でテスト実行、`npm run lint` でLinter実行

## フロントエンドCD（継続的デリバリー）

- **GitHub Actions などのCI/CDツールを利用し、`main`ブランチへのpush時に自動でビルド・デプロイを実施**
    - `frontend/` ディレクトリで `npm run build` を実行し、`build/` 配下の静的ファイルを生成
    - 生成された `build/` 配下のファイルを、GCP Cloud Storage バケットに自動アップロード
    - アップロードには `gsutil rsync` や `google-github-actions/upload-cloud-storage` などの公式Actionを利用
    - バケットは静的ウェブサイトホスティングを有効化し、公開設定・HTTPS配信はGCPの公式手順に従う
    - 認証情報（サービスアカウントキー等）はGitHub Secretsで安全に管理

## バックエンド構成

- ディレクトリ: `backend/`
- 主要ファイル:  
  - `app/main.py`（FastAPIアプリ本体、/healthエンドポイント含む）
  - `pyproject.toml`, `uv.lock`（uv依存管理）
  - `.env`（バックエンド用環境変数）
  - `Dockerfile`（本番用: マルチステージビルド, uv仮想環境を/app/.venv配下に作成）
  - `dev.Dockerfile`（開発用: ホットリロード・IDE連携向け）

## バックエンド開発・運用のDocker構成

- `dev` サービス: 開発用。`dev.Dockerfile`を利用し、IDEのPython interpreterとしても利用可能。ホットリロードやボリューム同期で快適な開発体験。
- `backend` サービス: 本番用Dockerfileでビルドし、本番相当の動作確認用。
- `test` サービス: Linter・テスト（ruff, black, pytest）をまとめて実行。`ruff check && black --check . && pytest tests` を直接実行。
- `uv` サービス: uvコマンドで依存関係を変更・管理する用途。

## バックエンド実装補足

- FastAPI で REST API を実装
- 画像アップロード、生成、取得の各エンドポイントを提供
- Replicate API との連携は `POST /generate` で実施（アイコン生成）
- 画像ファイルは一時ディレクトリに保存し、IDで管理
- `/health` エンドポイントで稼働確認

## バックエンド実装補足（テスト・Linter）

- テスト: pytest による自動テスト
- Linter: ruff による静的解析
- `docker compose run --rm test` でLinter・テストをまとめて実行（`ruff check && black --check . && pytest tests` を実行）
- 依存管理の変更は `docker compose run --rm uv add <パッケージ名>` などで実施

## デプロイ・運用（GCP）

- **フロントエンドはビルド成果物（静的ファイル）をGCP Cloud Storageに配置し、静的ウェブサイトとして公開**
    - `frontend/` ディレクトリで `npm run build` し、`build/` 配下をCloud Storageバケットにアップロード
    - Cloud Storageの静的ウェブサイトホスティング機能を利用
    - バケットのパブリック設定やHTTPS配信はGCPの公式手順に従う
- **バックエンドはDockerイメージをCloud Runにデプロイ**
    - `backend/` ディレクトリでDockerビルドし、Google Container Registry/Artifact Registryにpush
    - Cloud Runサービスとしてデプロイし、HTTPSエンドポイントを公開
    - 必要な環境変数はCloud Runのサービス設定で指定
    - 認証やCORS設定に注意

## ローカル開発

- ローカルでは `docker-compose.yml` で backend, frontend サービスを管理
- 本番はGCP（Cloud Storage/Cloud Run）で稼働
