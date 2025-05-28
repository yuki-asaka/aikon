# 技術構成

## 技術スタック

| 領域         | 技術・バージョン                                      |
|--------------|------------------------------------------------------|
| フロントエンド | React 18.x, Tailwind CSS 3.x, Node.js 22.x, npm     |
| バックエンド   | FastAPI 0.110.x, Python 3.12.x                      |
| 依存管理      | Poetry 1.8.x（バックエンド）, npm（フロントエンド）   |
| 推論エンジン   | Replicate API（Stable Diffusion）                    |
| コンテナ      | Docker 24.x, docker-compose 2.x                      |
| 開発環境      | PyCharm, Docker interpreter                          |

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

## Docker・開発運用

- `docker-compose.yml` で backend, frontend サービスを管理
  - 各サービスで `.env` ファイルを分離
  - backendは `/health` エンドポイントでhealthcheck
  - frontendは `npm run dev` でホットリロード
- バックエンドの仮想環境は `/opt/venv` 配下に作成し、PATHを通して実行
- 本番環境では `appuser` 権限で安全に実行
- バックエンドは `python -m uvicorn app.main:app ...` 形式で起動しローダ問題を回避

## 出力画像

- 形式: PNG
- サイズ: 400x400px

