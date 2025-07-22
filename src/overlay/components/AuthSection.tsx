import React, { useState } from "react";
import { auth } from '../../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential
} from "firebase/auth";

export const AuthSection: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let userCredential: UserCredential;
      if (mode === "login") {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in user:", userCredential.user);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Save displayName to Firebase Auth profile
        await updateProfile(userCredential.user, {
          displayName: username,
        });
        console.log("Registered user:", userCredential.user);
      }
      // TODO: Implement registration and login success responses
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 border-t border-gray-700 max-w-md mx-auto text-sm">
      <h2 className="text-base font-bold mb-4 text-center">
        {mode === "login" ? "Login to your Infinity Account" : "Register an Infinity Account"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
              required
            />
          </div>
        )}
        {mode === "login" && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
            required
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white placeholder-gray-400"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`rounded p-2 font-semibold ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-2 text-xs text-blue-400 underline block text-center"
      >
        {mode === "login" ? "Create an account" : "Already have an account?"}
      </button>
    </section>
  );
};
