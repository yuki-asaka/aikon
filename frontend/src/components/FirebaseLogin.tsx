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
      <div className="max-w-sm mx-auto mt-16 p-6 border border-gray-200 rounded-lg bg-white shadow text-center">
        <div className="mb-2 text-gray-700">ログイン済み: {user.email}</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={isSigningUp ? handleSignup : handleLogin}
      className="max-w-sm w-full mx-auto mt-16 p-8 border border-gray-200 rounded-lg bg-white shadow"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center tracking-tight">
        {isSigningUp ? "サインアップ" : "ログイン"}
      </h2>
      <div className="mb-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          required
        />
      </div>
      {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition mb-3"
      >
        {isSigningUp ? "サインアップ" : "ログイン"}
      </button>
      <button
        type="button"
        className="w-full bg-gray-100 hover:bg-gray-200 text-blue-700 font-semibold py-2 rounded transition border border-gray-300"
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
