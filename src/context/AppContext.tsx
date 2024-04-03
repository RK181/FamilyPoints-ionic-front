import { createContext, useContext, useEffect, useState } from "react";
import { ConnectDB } from "../storage/Store";
import { Configuration } from "../api/configuration";
import { Database } from "@ionic/storage";
import { API_URL, AUTH_EMAIL_KEY, DB_NAME, TOKEN_KEY } from "../constants/constants";

interface AppProps {
    isAuthenticated?: boolean,
    authEmail?: string,
    apiConf?: Configuration,
    setSession?: (isAuthenticated: boolean, token: string, email: string) => Promise<void>
};

const AppContext = createContext<AppProps>({});

export function AppProvider ({children}: any) {
    //let db: Database
    const [db, setDb] = useState<Database | null>(null);
    
    const [isAuthenticated, setAuthState] = useState<boolean>(false);
    const [authEmail, setAuthEmail] = useState<string>('');
    const [apiConf, setApiConf] = useState<Configuration>(new Configuration({basePath: API_URL, accessToken: ''}));

    useEffect(() => {
        async function loadAccesToken() {
            if (db != null) {
                const token = await db.get(TOKEN_KEY)!

                if (token != null && token != "") {
                    setApiConf(new Configuration({basePath: API_URL, accessToken: token}))
                    setAuthState(true);
                    console.log('Got from storage: ' + token);

                    const email = await db.get(AUTH_EMAIL_KEY)!
                    if (email != null) {
                        setAuthEmail(email);
                    }
                    console.log('Got from storage: ' + email)

                }
            } else { 
                setDb(await ConnectDB(DB_NAME));
            }
        }
        loadAccesToken();
    }, [db]);


    const setSession = async (isAuthenticated: boolean, token: string, email: string): Promise<void> => {
        const config = new Configuration({basePath: API_URL, accessToken: token});
        setAuthState(isAuthenticated);
        setApiConf(config);
        setAuthEmail(email);
        db.set(TOKEN_KEY, token)
        db.set(AUTH_EMAIL_KEY, email)
    };

    const value = {
        isAuthenticated,
        authEmail,
        apiConf,
        setSession
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    return useContext(AppContext);
};