import React from 'react';
import GenerateIllustration from "./components/GenerateIllustration";
import { FirebaseLogin } from "./components/FirebaseLogin";
import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseApp } from "./firebaseConfig";

const auth = getAuth(firebaseApp);

export default function App() {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                <span>読み込み中...</span>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center px-4 relative">
            {/* ログアウトボタンを右上に配置 */}
            {user && (
                <button
                    onClick={() => signOut(auth)}
                    className="absolute top-4 right-4 bg-gray-400 text-white py-2 px-4 rounded shadow"
                >
                    ログアウト
                </button>
            )}
            {!user ? (
                <FirebaseLogin />
            ) : (
                <>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center mt-10 mb-6 text-blue-700 tracking-tight drop-shadow">
                        aikon
                    </h1>
                    <GenerateIllustration />
                </>
            )}
            <footer className="mt-10 text-xs text-gray-400 text-center">
                &copy; {new Date().getFullYear()} aikon
            </footer>
        </div>
    );
}

