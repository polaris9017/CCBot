import {usePathname} from "next/navigation";
import {createContext, useContext, useEffect, useState} from "react";
import type {Session} from "next-auth";
import {getSession} from "@/serverActions/auth";

const SessionContent = createContext<Session | null>(null);

export const SessionProvider = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        getSession().then(res => setSession(res));
    }, [pathname]);

    return (
        <SessionContent.Provider value={session}>
            {children}
        </SessionContent.Provider>
    );
}

export const useSession = () => {
    return useContext(SessionContent);
};