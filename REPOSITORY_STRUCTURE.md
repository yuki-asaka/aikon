# リポジトリ構成

```
aikon/
├── backend/                # FastAPI バックエンド
│   ├── app/                # バックエンドアプリ本体
│   │   ├── main.py
│   │   └── ... 
│   ├── requirements.txt    # Python依存パッケージ
│   └── Dockerfile          # バックエンド用Dockerfile
├── frontend/               # React フロントエンド
│   ├── src/
│   ├── package.json
│   └── ... 
├── docs/                   # ドキュメント
│   ├── 02_tech_stack.md
│   ├── 05_coding_guidelines.md
│   └── ...
├── .env                    # 環境変数ファイル（必要に応じて）
├── docker-compose.yml      # 開発用コンテナ構成
└── REPOSITORY_STRUCTURE.md # このファイル
```
