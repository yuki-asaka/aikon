import React from 'react';
import GenerateIllustration from "./components/GenerateIllustration";

export default function App() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-center mt-8 mb-4">AIイラスト生成</h1>
            <GenerateIllustration />
        </div>
    );
}
