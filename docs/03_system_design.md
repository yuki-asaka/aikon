# システム構成と処理の流れ

## アーキテクチャ図

```
┌────────────┐ POST /upload
│ Frontend UI │ ───────────────────▶ │ FastAPI Backend │
│ React + Tailwind │ ◀────── 生成画像URL
└────────────┘     │
                   ▼
[ Replicate API による画像生成 ]
```

## API 概要

| エンドポイント | 内容 |
|----------------|------|
| POST `/upload` | 画像アップロード |
| POST `/generate` | 外部APIを呼び出し画像生成 |
| GET `/result/{id}` | 画像取得 |

## バックエンドAPI設計・処理フロー

1. `POST /upload`  
   - ユーザーから画像ファイルを受信し、一時保存
   - レスポンスで画像IDを返却

2. `POST /generate`  
   - 画像IDとスタイル等のパラメータを受け取り、Replicate API へリクエスト
   - 生成処理後、結果画像を保存し、結果IDを返却

3. `GET /result/{id}`  
   - 結果IDで生成済み画像を返却

4. `GET /health`  
   - サービス稼働確認用

---

## 例: APIリクエスト/レスポンス

- `/upload`  
  - リクエスト: multipart/form-data（画像ファイル）
  - レスポンス: `{ "image_id": "xxxx" }`

- `/generate`  
  - リクエスト: `{ "image_id": "xxxx", "style": "anime" }`
  - レスポンス: `{ "result_id": "yyyy" }`

- `/result/yyyy`  
  - 画像データ（PNG）
