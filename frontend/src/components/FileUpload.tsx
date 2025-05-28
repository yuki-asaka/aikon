import React, { useState } from "react";

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("ファイルを選択してください");
            return;
        }
        setUploading(true);
        setMessage(null);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // TODO: アップロードAPIのエンドポイントに合わせてURLを修正
            const res = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                setMessage("アップロード成功");
            } else {
                setMessage("アップロード失敗");
            }
        } catch (e) {
            setMessage("通信エラーが発生しました");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border rounded shadow w-full max-w-md mx-auto">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="file:mr-4"
            />
            <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {uploading ? "アップロード中..." : "送信"}
            </button>
            {message && <div className="text-sm text-gray-700">{message}</div>}
        </div>
    );
};

export default FileUpload;
