import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const auth = getAuth(firebaseApp);

export const FirebaseLogin: React.FC = () => {
  const [user] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (user) {
    return (
      <div
        className="max-w-sm mx-auto mt-16 p-6 border rounded-lg shadow text-center"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)"
        }}
      >
        <div className="mb-2" style={{ color: "var(--color-text)" }}>
          ログイン済み: {user.email}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={isSigningUp ? handleSignup : handleLogin}
      className="max-w-sm w-full mx-auto mt-16 p-8 border rounded-lg shadow"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-border)",
        color: "var(--color-text)"
      }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center tracking-tight"
        style={{ color: "var(--color-accent)" }}>
        {isSigningUp ? "サインアップ" : "ログイン"}
      </h2>
      <div className="mb-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          required
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-bg-secondary)",
            color: "var(--color-text)"
          }}
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="block w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          required
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-bg-secondary)",
            color: "var(--color-text)"
          }}
        />
      </div>
      {error && <div className="mb-4 text-sm text-center" style={{ color: "var(--color-error)" }}>{error}</div>}
      <button
        type="submit"
        className="w-full font-semibold py-2 rounded transition mb-3"
        style={{
          background: "var(--color-accent)",
          color: "#fff"
        }}
      >
        {isSigningUp ? "サインアップ" : "ログイン"}
      </button>
      <button
        type="button"
        className="w-full font-semibold py-2 rounded transition border"
        style={{
          background: "var(--color-bg-secondary)",
          color: "var(--color-accent)",
          borderColor: "var(--color-border)"
        }}
        onClick={() => {
          setIsSigningUp(!isSigningUp);
          setError(null);
        }}
      >
        {isSigningUp ? "ログインへ" : "サインアップ"}
      </button>
    </form>
  );
};
