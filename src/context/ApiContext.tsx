import { createContext, useContext, useEffect, useState } from "react";
import { ConnectDB, TOKEN_KEY } from "../storage/Store";
import { Configuration } from "../api/configuration";
import { Database } from "@ionic/storage";



const API_URL = "http://localhost:8000/api".replace(/\/+$/, "");



interface ApiProps {
    isAuthenticated?: boolean,
    apiConf?: Configuration,
    setSession?: (isAuthenticated: boolean, token: string) => Promise<void>
};

const ApiContext = createContext<ApiProps>({});

export function ApiProvider ({children}: any) {
    let db: Database
    const [isAuthenticated, setAuthState] = useState<boolean>(false);
    const [apiConf, setApiConf] = useState<Configuration>(new Configuration({basePath: API_URL, accessToken: ''}));

    useEffect(() => {
        async function loadAccesToken() {
            db = await ConnectDB("appStorage")
            const token = await db.get(TOKEN_KEY)!

            if (token != null && token != "") {
                setApiConf(new Configuration({basePath: API_URL, accessToken: token}))
                setAuthState(true);
                console.log(token)
            }
        }
        loadAccesToken();
    }, []);


    const setSession = async (isAuthenticated: boolean, token: string): Promise<void> => {
        const config = new Configuration({basePath: API_URL, accessToken: token});
        setAuthState(isAuthenticated);
        setApiConf(config);
        db.set(TOKEN_KEY, token)
    };

    const value = {
        isAuthenticated,
        apiConf,
        setSession
    }

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
    return useContext(ApiContext);
};