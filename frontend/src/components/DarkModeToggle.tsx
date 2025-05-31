import React, { useEffect, useState } from "react";

const DarkModeToggle: React.FC = () => {
    const [dark, setDark] = useState(
        () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    return (
        <button
            onClick={() => setDark((v) => !v)}
            aria-label="ダークモード切替"
            className="text-2xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            {dark ? "🌙" : "☀️"}
        </button>
    );
};

export default DarkModeToggle;
