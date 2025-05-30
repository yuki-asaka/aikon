import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function GenerateIllustration() {
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState("anime");
  const [removeBg, setRemoveBg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bgRemovedImage, setBgRemovedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setImageUrl(null);
    setError(null);
    setBgRemovedImage(null);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };

  const handleRemoveBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoveBg(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("画像ファイルを選択してください");
      return;
    }
    setLoading(true);
    setError(null);
    setImageUrl(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("style", style);
    formData.append("remove_bg", String(removeBg));

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "生成に失敗しました");
      }
      const data = await res.json();
      setImageUrl(data.image_url);
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  // 背景除去のみ実行
  const handleRemoveBgOnly = async () => {
    if (!file) {
      setError("画像ファイルを選択してください");
      return;
    }
    setLoading(true);
    setError(null);
    setBgRemovedImage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/remove_bg`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "背景除去に失敗しました");
      }
      const data = await res.json();
      setBgRemovedImage(`data:image/png;base64,${data.image_base64}`);
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-bold">画像ファイル</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-bold">スタイル</label>
          <select
            value={style}
            onChange={handleStyleChange}
            className="w-full border rounded p-1"
          >
            <option value="anime">アニメ風</option>
            <option value="cartoon">カートゥーン風</option>
          </select>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={removeBg}
              onChange={handleRemoveBgChange}
              className="mr-2"
            />
            背景を除去してからイラスト化する
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "生成中..." : "イラスト生成"}
          </button>
          <button
            type="button"
            disabled={loading || !file}
            onClick={handleRemoveBgOnly}
            className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "処理中..." : "背景除去のみ"}
          </button>
        </div>
      </form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {bgRemovedImage && (
        <div className="mt-4">
          <div className="font-bold mb-1">背景除去結果プレビュー</div>
          <img
            src={bgRemovedImage}
            alt="背景除去画像"
            className="mx-auto border bg-white max-w-xs max-h-xs"
            style={{ maxWidth: "256px", maxHeight: "256px" }}
          />
        </div>
      )}
      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt="生成イラスト"
            className="mx-auto border max-w-xs max-h-xs"
            style={{ maxWidth: "256px", maxHeight: "256px" }}
          />
        </div>
      )}
    </div>
  );
}
