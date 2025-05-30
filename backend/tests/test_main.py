import io

from fastapi.testclient import TestClient
from main import app
from PIL import Image

client = TestClient(app)


def create_test_image_bytes(color=(255, 0, 0), size=(512, 512)):
    img = Image.new("RGB", size, color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()


def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_upload_image_success():
    img_bytes = create_test_image_bytes()
    files = {"file": ("test.png", img_bytes, "image/png")}
    res = client.post("/upload", files=files)
    assert res.status_code == 200
    assert res.json()["filename"] == "test.png"


def test_upload_image_invalid():
    files = {"file": ("test.txt", b"not an image", "text/plain")}
    res = client.post("/upload", files=files)
    assert res.status_code == 400


def test_remove_bg_success(monkeypatch):
    img_bytes = create_test_image_bytes()
    files = {"file": ("test.png", img_bytes, "image/png")}

    # override remove_bg_with_rembg to return a test image
    async def fake_remove_bg_with_rembg(file):
        return create_test_image_bytes((0, 255, 0))

    monkeypatch.setattr("main.remove_bg_with_rembg", fake_remove_bg_with_rembg)
    res = client.post("/remove_bg", files=files)
    assert res.status_code == 200
    assert "image_base64" in res.json()


def test_generate_illustration_invalid(monkeypatch):
    files = {"file": ("test.txt", b"not an image", "text/plain")}
    res = client.post("/generate", files=files, data={"style": "anime"})
    assert res.status_code == 400


def test_generate_illustration_success(monkeypatch):
    img_bytes = create_test_image_bytes()
    files = {"file": ("test.png", img_bytes, "image/png")}
    monkeypatch.setattr("replicate.run", lambda *a, **kw: {"output": "http://dummy/image.png"})
    res = client.post("/generate", files=files, data={"style": "anime"})
    assert res.status_code == 200
    assert "image_url" in res.json()
