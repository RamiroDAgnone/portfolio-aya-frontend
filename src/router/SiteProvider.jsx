import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../auth/constants";

const SiteContext = createContext({
    isPublic: false,
    isLoading: true
});

export function SiteProvider({ children }) {
    const [isPublic, setIsPublic] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    async function fetchStatus() {
        try {
            const res = await fetch(`${API_URL}/pages/site-status`);
            const data = await res.json();
            
            setIsPublic(data.isPublic);
            
        } catch (err) {
            setIsPublic(false);
        } finally {
            setIsLoading(false);
        }
    }

    fetchStatus();
    }, []);


    return (
        <SiteContext.Provider value={{ isPublic, isLoading }}>
        {children}
        </SiteContext.Provider>
    );
}

export function useSite() {
    return useContext(SiteContext);
}