import React, { useEffect } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthForm } from "./authForm";
import { useUser } from "../contexts/UserContext";

export const AuthSection: React.FC = () => {
    const { user, setUser } = useUser();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    return (
        <>
            {!user ? (
                <section className="p-4 max-w-md mx-auto text-sm">
                    <AuthForm />
                    <hr className="mx-8 my-4 border-gray-700" />
                </section>
            ) : null}
        </>
    );
};
