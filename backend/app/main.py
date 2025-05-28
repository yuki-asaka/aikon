import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="画像ファイルをアップロードしてください")
    return JSONResponse(content={"filename": file.filename, "content_type": file.content_type})

@app.post("/generate")
async def generate_illustration(file: UploadFile = File(...), style: str = "anime"):
    import replicate
    import tempfile
    import traceback

    api_token = os.getenv("REPLICATE_API_TOKEN")
    if not api_token:
        raise HTTPException(status_code=500, detail="Replicate APIトークンが設定されていません")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="画像ファイルをアップロードしてください")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp.flush()
            image_path = tmp.name

        model = "pnyompen/sd-controlnet-lora"
        version = "37ceaf8d4df13e7fe7f1320413189c641c825210df7e40bc21072634a10029bb"

        prompt = "artistic caricature, abstract shapes, vibrant and dynamic colors, unique style"
        if style == "cartoon":
            prompt = "cartoon caricature, exaggerated expressions, bold outlines, playful style"

        input_params = {
            "image": open(image_path, "rb"),
            "prompt": prompt,
            "image_strength": 0.7,
            "guidance_scale": 15
        }

        output = replicate.run(
            f"{model}:{version}",
            input=input_params,
            api_token=api_token,
        )

        if isinstance(output, list) and len(output) > 0:
            first = output[0]
            url = getattr(first, "url", None)
            if url:
                return {"image_url": url}
            raise Exception(f"Replicate API FileOutput: {repr(first)}")

        if isinstance(output, dict) and "output" in output:
            return {"image_url": output["output"]}

        raise Exception(f"Replicate APIレスポンス: {output}")
    except Exception as e:
        tb = traceback.format_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Replicate APIから画像生成に失敗しました: {str(e)}\n{tb}"
        )
