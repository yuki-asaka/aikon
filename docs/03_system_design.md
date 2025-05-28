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

