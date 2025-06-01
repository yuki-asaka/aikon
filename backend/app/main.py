import base64
import os

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image

app = FastAPI()

frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
origins = [origin.strip() for origin in frontend_origin.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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


async def remove_bg_with_rembg(image_bytes: bytes) -> bytes:
    from rembg import remove
    result = remove(image_bytes)
    return result


async def remove_bg_with_rembg_and_white_bg(image_bytes: bytes) -> bytes:
    import io
    from PIL import Image, ImageFilter
    from rembg import remove

    fg = Image.open(io.BytesIO(remove(image_bytes))).convert("RGBA")
    alpha = fg.split()[3].filter(ImageFilter.GaussianBlur(radius=4))
    fg.putalpha(alpha)
    bg = Image.new("RGBA", fg.size, (255, 255, 255, 255))
    composited = Image.alpha_composite(bg, fg)
    out = io.BytesIO()
    composited.convert("RGB").save(out, format="PNG")
    return out.getvalue()


@app.post("/remove_bg")
async def remove_bg(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="画像ファイルをアップロードしてください")
    try:
        image_bytes = await file.read()
        result_bytes = await remove_bg_with_rembg(image_bytes)
        encoded = base64.b64encode(result_bytes).decode("utf-8")
        return JSONResponse(
            content={"message": "背景除去成功", "size": len(result_bytes), "image_base64": encoded},
            headers={"Content-Type": "application/json"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"背景除去失敗: {str(e)}")


def crop_center_face_opencv(image: Image, size: int = 400) -> Image:
    img_np = np.array(image)
    gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) > 0:
        x, y, w, h = faces[0]
        face_center_x = x + w // 2
        face_center_y = y + h // 2
    else:
        # face not detected, use image center
        face_center_x = image.width // 2
        face_center_y = image.height // 2

    half = size // 2
    left_crop = max(0, face_center_x - half)
    upper_crop = max(0, face_center_y - half)
    right_crop = min(image.width, face_center_x + half)
    lower_crop = min(image.height, face_center_y + half)

    cropped = image.crop((left_crop, upper_crop, right_crop, lower_crop))
    if cropped.size != (size, size):
        new_img = Image.new("RGB", (size, size), (255, 255, 255))
        offset = ((size - cropped.width) // 2, (size - cropped.height) // 2)
        new_img.paste(cropped, offset)
        return new_img
    return cropped


@app.post("/generate")
async def generate_illustration(
    file: UploadFile = File(...), style: str = Form("anime"), remove_bg: bool = Form(False)
):
    import io
    import tempfile
    import traceback

    import replicate
    from PIL import Image

    api_token = os.getenv("REPLICATE_API_TOKEN")
    if not api_token:
        raise HTTPException(status_code=500, detail="Replicate APIトークンが設定されていません")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="画像ファイルをアップロードしてください")

    try:
        image_bytes = await file.read()
        if remove_bg:
            input_bytes = await remove_bg_with_rembg_and_white_bg(image_bytes)
        else:
            input_bytes = image_bytes

        image = Image.open(io.BytesIO(input_bytes)).convert("RGB")
        image = crop_center_face_opencv(image, 400)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            image.save(tmp, format="PNG")
            tmp.flush()
            image_path = tmp.name

        model = "pnyompen/sd-controlnet-lora"
        version = "37ceaf8d4df13e7fe7f1320413189c641c825210df7e40bc21072634a10029bb"

        if style == "cartoon":
            prompt = "cartoon caricature, exaggerated expressions, bold outlines, playful style"
        else:
            prompt = "marker sketch style, hand-drawn illustration, bold lines, minimal shading"

        if remove_bg:
            prompt += ", plain white background, no shadows"

        input_params = {"image": open(image_path, "rb"), "prompt": prompt, "image_strength": 0.7, "guidance_scale": 15}

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
        raise HTTPException(status_code=500, detail=f"Replicate APIから画像生成に失敗しました: {str(e)}\n{tb}")
