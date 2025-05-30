import React from 'react';
import GenerateIllustration from "./components/GenerateIllustration";

export default function App() {
    return (
        <div className="min-h-dvh bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-center mt-10 mb-6 text-blue-700 tracking-tight drop-shadow">
                AIイラスト生成
            </h1>
            <GenerateIllustration />
            <footer className="mt-10 text-xs text-gray-400 text-center">
                &copy; {new Date().getFullYear()} aikon
            </footer>
        </div>
    );
}
