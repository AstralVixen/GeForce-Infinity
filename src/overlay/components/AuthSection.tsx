import React, { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AuthForm } from "./AuthForm";
import { LoggedInPanel } from "./LoggedInPanel";

export const AuthSection: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <section className="p-4 border-t border-gray-700 max-w-md mx-auto text-sm">
      {user ? <LoggedInPanel user={user} /> : <AuthForm />}
    </section>
  );
};
