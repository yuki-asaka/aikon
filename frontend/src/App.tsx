import React from 'react';
import GenerateIllustration from "./components/GenerateIllustration";
import {FirebaseLogin} from "./components/FirebaseLogin";
import {getAuth, signOut} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {firebaseApp} from "./firebaseConfig";
import DarkModeToggle from "./components/DarkModeToggle";

const auth = getAuth(firebaseApp);

export default function App() {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (<div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
                <span style={{ color: "var(--color-text)" }}>読み込み中...</span>
            </div>);
    }

    return (
        <div
            className="min-h-dvh flex flex-col items-center justify-center px-4 relative"
            style={{
                background: "linear-gradient(to bottom right, var(--color-bg), var(--color-bg-secondary))",
                color: "var(--color-text)"
            }}
        >
            {user && (<div className="absolute top-4 right-4 flex items-center gap-2">
                    <DarkModeToggle/>
                    <button
                        onClick={() => signOut(auth)}
                        className="bg-gray-400 text-white py-2 px-4 rounded shadow"
                    >
                        ログアウト
                    </button>
                </div>)}
            {!user ? (<FirebaseLogin/>) : (<>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-center mt-10 mb-6 tracking-tight drop-shadow"
                        style={{ color: "var(--color-accent)" }}>
                        <img src="/logo.svg" alt="Aikon Logo" className="inline-block h-10 mr-2"/>
                    </h1>
                    <GenerateIllustration/>
                </>)}
            <footer className="mt-10 text-xs text-center"
                style={{ color: "var(--color-border)" }}>
                &copy; {new Date().getFullYear()} aikon
            </footer>
        </div>
    );
}
