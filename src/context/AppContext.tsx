import { createContext, useContext, useEffect, useState } from "react";
import { ConnectDB } from "../storage/Store";
import { Configuration } from "../api/configuration";
import { Database } from "@ionic/storage";
import { API_URL, TOKEN_KEY } from "../constants/constants";

interface AppProps {
    isAuthenticated?: boolean,
    apiConf?: Configuration,
    setSession?: (isAuthenticated: boolean, token: string) => Promise<void>
};

const AppContext = createContext<AppProps>({});

export function AppProvider ({children}: any) {
    //let db: Database
    const [db, setDb] = useState<Database | null>(null);
    
    const [isAuthenticated, setAuthState] = useState<boolean>(false);
    const [apiConf, setApiConf] = useState<Configuration>(new Configuration({basePath: API_URL, accessToken: ''}));

    useEffect(() => {
        async function loadAccesToken() {
            if (db != null) {
                const token = await db.get(TOKEN_KEY)!

                if (token != null && token != "") {
                    setApiConf(new Configuration({basePath: API_URL, accessToken: token}))
                    setAuthState(true);
                    console.log(token)
                }
            }else{ 
                setDb(await ConnectDB("appStorage"));
            }
        }
        loadAccesToken();
    }, [db]);


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

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    return useContext(AppContext);
};