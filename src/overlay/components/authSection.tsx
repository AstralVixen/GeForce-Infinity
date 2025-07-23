import React, { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthForm } from "./authForm";
import { LoggedInPanel } from "./loggedInPanel";

export const AuthSection: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    return (
        <section className="p-4 max-w-md mx-auto text-sm">
            {user ? <LoggedInPanel user={user} /> : <AuthForm />}
        </section>
    );
};
