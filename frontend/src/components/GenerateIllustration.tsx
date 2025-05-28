import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function GenerateIllustration() {
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState("anime");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setImageUrl(null);
    setError(null);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "生成中..." : "イラスト生成"}
        </button>
      </form>
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="生成イラスト" className="w-64 h-64 object-contain mx-auto border" />
        </div>
      )}
    </div>
  );
}
