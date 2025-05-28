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

## 補足

- Poetry管理下で開発する場合、`backend/pyproject.toml` をプロジェクトルートで作成してください。
- `poetry.lock` は `poetry install` 実行時に自動生成されます。
- どちらも未作成の場合は、`poetry init` で `pyproject.toml` を作成し、必要なパッケージを追加してください。
- Dockerイメージはマルチステージビルドで、Poetry仮想環境を `/opt/venv` 配下に作成し、本番ステージでパスを通して実行します。
- `docker-compose.yml` では、バックエンド・フロントエンドそれぞれで `.env` ファイルを分離して管理します。
- バックエンド開発時はボリュームマウントにより `/app` 配下が上書きされるため、仮想環境は `/opt/venv` などマウントされない場所に作成しています。
- Uvicornの実行は `python -m uvicorn ...` 形式でローダ問題を回避しています。

## 出力画像

- 形式: PNG
- サイズ: 400x400px

