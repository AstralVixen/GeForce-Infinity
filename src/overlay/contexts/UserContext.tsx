import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserContext as UserContextType } from "../../shared/types";
import { User } from "firebase/auth";

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loading: true,
    setLoading: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </UserContext.Provider>
    );
};
