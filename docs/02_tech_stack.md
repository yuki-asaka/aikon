# 技術構成

## 技術スタック

| 領域         | 技術・バージョン                                      |
|--------------|------------------------------------------------------|
| フロントエンド | React 18.x, Tailwind CSS 3.x, Node.js 22.x, npm     |
| バックエンド   | FastAPI 0.110.x, Python 3.12.x                      |
| 依存管理      | Poetry 1.8.x（バックエンド）, npm（フロントエンド）   |
| 推論エンジン   | Replicate API（Stable Diffusion, ControlNet, InstantID等） |
| コンテナ      | Docker 24.x, docker-compose 2.x                      |
| 開発環境      | PyCharm, Docker interpreter                          |
| バックエンドテスト | pytest                                            |
| バックエンドLinter | ruff                                            |
| フロントエンドテスト | Jest                                           |
| フロントエンドLinter | ESLint                                        |
| 認証         | Firebase Authentication（Googleアカウント等）         |

## フロントエンド構成

- ディレクトリ: `frontend/`
- 主要ファイル:  
  - `package.json`（React, Tailwind, 開発用スクリプト等を管理）
  - `src/`（Reactコンポーネント、エントリポイント）
  - `public/`（HTMLテンプレート等）
  - `.env`（フロントエンド用環境変数）

## バックエンド構成

- ディレクトリ: `backend/`
- 主要ファイル:  
  - `app/main.py`（FastAPIアプリ本体、/healthエンドポイント含む）
  - `pyproject.toml`, `poetry.lock`（Poetry依存管理）
  - `.env`（バックエンド用環境変数）
  - `Dockerfile`（マルチステージビルド、Poetry仮想環境を/opt/venv配下に作成）

## バックエンド実装補足

- FastAPI で REST API を実装
- 画像アップロード、生成、取得の各エンドポイントを提供
- Replicate API との連携は `POST /generate` で実施（アイコン生成）
- 画像ファイルは一時ディレクトリに保存し、IDで管理
- `/health` エンドポイントで稼働確認

## フロントエンド実装補足

- テスト: Jest によるユニットテスト
- Linter: ESLint による静的解析
- `npm test` でテスト実行、`npm run lint` でLinter実行

## バックエンド実装補足（テスト・Linter）

- テスト: pytest による自動テスト
- Linter: ruff による静的解析
- `poetry run pytest` でテスト実行、`poetry run ruff app/` でLinter実行

## Docker・開発運用

- `docker-compose.yml` で backend, frontend サービスを管理
  - 各サービスで `.env` ファイルを分離
  - backendは `/health` エンドポイントでhealthcheck
  - frontendは `npm run dev` でホットリロード
- バックエンドの仮想環境は `/opt/venv` 配下に作成し、PATHを通して実行
- 本番環境では `appuser` 権限で安全に実行
- バックエンドは `python -m uvicorn app.main:app ...` 形式で起動しローダ問題を回避

