// import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
    id: "",
    name: "",
    username: "",
    email: "",
    imageUrl: "",
    bio: "",
};

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean,
};

type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const navigate = useNavigate()

    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkAuthUser = async () => {
        try {
            const currentUser = await getCurrentUser();

            if (currentUser) {

                setUser({
                    id: currentUser.$id,
                    name: currentUser.name,
                    username: currentUser.username,
                    email: currentUser.email,
                    bio: currentUser.bio,
                    imageUrl: currentUser.imageUrl
                });

                setIsAuthenticated(true)

                return true;
            }

            return false;
        } catch (er: any) {
            console.log(er);
            return false;


        } finally { setIsLoading(false) }
    }

    useEffect(() => {
        if (
            localStorage.getItem('cookieFallback') === '[]' ||
            localStorage.getItem('cookieFallback') === null
        ) {
            navigate('/sign-in')
        }

        checkAuthUser();

    }, [])
    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext) 