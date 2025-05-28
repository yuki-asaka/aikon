import React from 'react';
import FileUpload from "./components/FileUpload";


export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-6">画像アップロード</h1>
            <FileUpload />
        </div>
    );
}
