# リポジトリ構成

```
aikon/
├── backend/                # FastAPI バックエンド
│   ├── app/                # バックエンドアプリ本体
│   │   ├── main.py
│   │   └── ... 
│   ├── pyproject.toml      # Poetry依存管理ファイル
│   ├── poetry.lock         # Poetryロックファイル
│   ├── .env                # バックエンド用環境変数ファイル
│   └── Dockerfile          # バックエンド用Dockerfile
├── frontend/               # React フロントエンド
│   ├── src/
│   ├── package.json
│   ├── .env                # フロントエンド用環境変数ファイル
│   └── ... 
├── docs/                   # ドキュメント
│   ├── 02_tech_stack.md
│   ├── 05_coding_guidelines.md
│   └── ...
├── docker-compose.yml      # 開発用コンテナ構成
└── REPOSITORY_STRUCTURE.md # このファイル
```

- `.env` ファイルは backend, frontend で分離管理します。
- バックエンドの依存管理は Poetry（`pyproject.toml`/`poetry.lock`）を利用します。
````

</file>

### /Users/yuki/dev/IdeaProjects/aikon/docs/02_tech_stack.md

- 仮想環境の場所・パスの扱い・`python -m uvicorn` 実行・`.env`分離・healthcheck など、現状の構成を明記

<file>
```markdown
// filepath: /Users/yuki/dev/IdeaProjects/aikon/docs/02_tech_stack.md
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
- バックエンド・フロントエンドそれぞれで `.env` ファイルを分離して管理します（`backend/.env`, `frontend/.env`）。
- バックエンド開発時はボリュームマウントにより `/app` 配下が上書きされるため、仮想環境は `/opt/venv` などマウントされない場所に作成しています。
- Uvicornの実行は `python -m uvicorn app.main:app ...` 形式でローダ問題を回避しています。
- バックエンドには `/health` エンドポイントを実装し、docker compose の `healthcheck` で利用しています。
- Dockerfileでは、仮想環境ディレクトリ名がランダムなため、`aikon-venv`としてコピーし、`PATH`に追加しています。
- 本番環境では `appuser` 権限で安全に実行されます。

## 出力画像

- 形式: PNG
- サイズ: 400x400px

