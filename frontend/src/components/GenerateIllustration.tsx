import React, {useState} from "react";

const API_URL = process.env.VITE_API_URL || "http://localhost:8000";

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
                method: "POST", body: formData,
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
                method: "POST", body: formData,
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
        <div
            className="w-full max-w-lg mx-auto p-8 rounded-3xl shadow-2xl border backdrop-blur-sm"
            style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)"
            }}
        >
            <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                    <label htmlFor="file-input" className="block mb-2 font-semibold"
                        style={{ color: "var(--color-text)" }}>画像ファイル</label>
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full border rounded-xl shadow-sm px-4 py-2 text-base bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        style={{
                            borderColor: "var(--color-border)",
                            background: "var(--color-bg-secondary)",
                            color: "var(--color-text)"
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="style-select" className="block mb-2 font-semibold"
                        style={{ color: "var(--color-text)" }}>スタイル</label>
                    <select
                        id="style-select"
                        value={style}
                        onChange={handleStyleChange}
                        className="w-full border rounded-xl p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        style={{
                            borderColor: "var(--color-border)",
                            background: "var(--color-bg-secondary)",
                            color: "var(--color-text)"
                        }}
                    >
                        <option value="anime">アニメ風</option>
                        <option value="cartoon">カートゥーン風</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="remove-bg-checkbox" className="inline-flex items-center cursor-pointer select-none">
                        <input
                            id="remove-bg-checkbox"
                            type="checkbox"
                            checked={removeBg}
                            onChange={handleRemoveBgChange}
                            className="mr-2 accent-blue-600 size-5"
                        />
                        <span style={{ color: "var(--color-text)" }}>背景を除去してからアイコン化する</span>
                    </label>
                </div>
                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl shadow-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: "linear-gradient(to right, var(--color-accent), #6366f1)",
                            color: "#fff"
                        }}
                    >
                        {loading ? "生成中..." : "アイコン生成"}
                    </button>
                    <button
                        type="button"
                        disabled={loading || !file}
                        onClick={handleRemoveBgOnly}
                        className="flex-1 py-2.5 rounded-xl shadow-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: "linear-gradient(to right, var(--color-success), #34d399)",
                            color: "#fff"
                        }}
                    >
                        {loading ? "処理中..." : "背景除去のみ"}
                    </button>
                </div>
            </form>
            {error && (
                <div className="mt-7 font-semibold text-center border rounded-xl p-3 shadow"
                    style={{
                        color: "var(--color-error)",
                        borderColor: "var(--color-error)",
                        background: "rgba(239,68,68,0.08)"
                    }}>
                    {error}
                </div>
            )}
            {bgRemovedImage && (
                <div className="mt-10 border-t pt-7" style={{ borderColor: "var(--color-border)" }}>
                    <div className="font-bold mb-3 text-center" style={{ color: "var(--color-text)" }}>背景除去結果プレビュー</div>
                    <img
                        src={bgRemovedImage}
                        alt="背景除去画像"
                        className="mx-auto border-2 rounded-2xl shadow-lg max-w-xs max-h-xs aspect-square object-contain"
                        style={{
                            maxWidth: "256px",
                            maxHeight: "256px",
                            borderColor: "var(--color-success)",
                            background: "var(--color-card)"
                        }}
                    />
                </div>
            )}
            {imageUrl && (
                <div className="mt-10 border-t pt-7" style={{ borderColor: "var(--color-border)" }}>
                    <div className="font-bold mb-3 text-center" style={{ color: "var(--color-text)" }}>生成アイコン</div>
                    <img
                        src={imageUrl}
                        alt="生成アイコン"
                        className="mx-auto border-2 rounded-2xl shadow-lg max-w-xs max-h-xs aspect-square object-contain"
                        style={{
                            maxWidth: "256px",
                            maxHeight: "256px",
                            borderColor: "var(--color-accent)"
                        }}
                    />
                </div>
            )}
        </div>
    );
}
