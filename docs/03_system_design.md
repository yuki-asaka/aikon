# システム構成と処理の流れ

## アーキテクチャ図

```
┌────────────┐ POST /upload
│ Frontend UI │ ───────────────────▶ │ FastAPI Backend │
│ React + Tailwind │ ◀────── 生成アイコンURL
└────────────┘     │
                   ▼
[ Replicate API によるアイコン生成 ]
    ▲
    │
  認証（Firebase Auth, IDトークン）
```

## API 概要

| エンドポイント | 内容 |
|----------------|------|
| POST `/upload` | 画像アップロード（認証必須/Firebase IDトークン） |
| POST `/generate` | 外部APIを呼び出しアイコン生成（認証必須/Firebase IDトークン） |
| GET `/result/{id}` | アイコン画像取得（認証必須/Firebase IDトークン） |
| GET `/health` | サービス稼働確認用（認証不要） |

## バックエンドAPI設計・処理フロー

1. **フロントエンドでFirebase Authenticationによるログインを実施**
   - Googleアカウント等でログインし、IDトークンを取得
   - 以降のAPIリクエスト時、HTTPヘッダ `Authorization: Bearer <Firebase IDトークン>` を付与

2. `POST /upload`  
   - Firebase IDトークンをヘッダで受け取り、バックエンドで検証
   - ユーザーから画像ファイルを受信し、一時保存
   - レスポンスで画像IDを返却

3. `POST /generate`  
   - Firebase IDトークンをヘッダで受け取り、バックエンドで検証
   - 画像IDとスタイル等のパラメータを受け取り、Replicate API へリクエスト
   - 生成処理後、結果アイコン画像を保存し、結果IDを返却

4. `GET /result/{id}`  
   - Firebase IDトークンをヘッダで受け取り、バックエンドで検証
   - 結果IDで生成済みアイコン画像を返却

5. `GET /health`  
   - サービス稼働確認用（認証不要）

---

## 例: APIリクエスト/レスポンス

- `/upload`  
  - リクエスト: multipart/form-data（画像ファイル, AuthorizationヘッダにFirebase IDトークン）
  - レスポンス: `{ "image_id": "xxxx" }`

- `/generate`  
  - リクエスト: `{ "image_id": "xxxx", "style": "anime" }`（Authorizationヘッダ必須）
  - レスポンス: `{ "result_id": "yyyy" }`

- `/result/yyyy`  
  - アイコン画像データ（PNG, Authorizationヘッダ必須）


