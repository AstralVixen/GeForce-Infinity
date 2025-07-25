import React, { useState } from "react";
import { auth } from "../../lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

import { syncFromCloud } from "../../utils/cloudSync";
import { Dialog } from "./dialog";

export const AuthForm: React.FC = () => {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Hold the event to submit after confirmation
    const [pendingSubmitEvent, setPendingSubmitEvent] =
        useState<React.FormEvent | null>(null);

    const handleConfirmLogin = async () => {
        setIsDialogOpen(false);
        if (!pendingSubmitEvent) return;

        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            await syncFromCloud();
            window.electronAPI.reloadGFN();
        } catch (err: any) {
            setError("Incorrect email or password, or account doesn't exist.");
        } finally {
            setLoading(false);
            setPendingSubmitEvent(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === "login") {
            // Instead of immediately logging in, show the confirmation dialog
            setPendingSubmitEvent(e);
            setIsDialogOpen(true);
        } else {
            setLoading(true);
            try {
                const userCred = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                await updateProfile(userCred.user, { displayName: username });
            } catch (err: any) {
                let message = "An error occurred";

                switch (err.code) {
                    case "auth/email-already-in-use":
                        message = "An account with this email already exists.";
                        break;
                    case "auth/invalid-email":
                        message = "Please enter a valid email address.";
                        break;
                    default:
                        message =
                            "Password is too weak. Use at least 8 characters, including uppercase, lowercase, numbers, and symbols.";
                        break;
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <h2 className="text-base font-bold mb-4 text-center">
                {mode === "login"
                    ? "Login to your Infinity Account"
                    : "Register an Infinity Account"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                {mode === "register" ? (
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-2 rounded bg-[#0c1015] text-white placeholder-gray-400"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 rounded bg-[#0c1015] text-white placeholder-gray-400"
                            required
                        />
                    </div>
                ) : (
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-2 rounded bg-[#0c1015] text-white placeholder-gray-400"
                        required
                    />
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 rounded bg-[#0c1015] text-white placeholder-gray-400"
                    required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`rounded text-white p-2 font-semibold ${
                        loading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading
                        ? "Please wait..."
                        : mode === "login"
                          ? "Login"
                          : "Register"}
                </button>
            </form>
            <div className="flex justify-between">
                <button
                    onClick={() =>
                        setMode(mode === "login" ? "register" : "login")
                    }
                    className="mt-2 text-xs text-blue-400 underline block text-center"
                >
                    {mode === "login"
                        ? "Create an account"
                        : "Already have an account?"}
                </button>
                {mode === "login" && (
                    <button
                        onClick={() =>
                            window.electronAPI.openExternal("forgot-password")
                        }
                        className="mt-2 text-xs text-blue-400 underline block text-center"
                    >
                        Forgot Password?
                    </button>
                )}
            </div>

            <Dialog
                title="Are you sure you want to log in?"
                confirmText="Yes"
                cancelText="No"
                setIsOpen={setIsDialogOpen}
                isOpen={isDialogOpen}
                handleConfirm={handleConfirmLogin}
            >
                <small>
                    This will kick you out of your game and restarts GFN!
                </small>
            </Dialog>
        </>
    );
};
