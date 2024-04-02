import { Storage, Drivers } from "@ionic/storage";

//let storage: Storage;
/*
export const CreateStore = (name: string) => {

    storage = new Storage({
        
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    storage.create();
}*/

export const ConnectDB = async (name: string) => {

    const storage = new Storage({
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    storage.create();
    return storage;
}

/*
export const storeSet = (key: string, val: string) => {

    storage.set(key, val);
}

export const storeGet = async (key: string) => {

    const val = await storage.get(key);
    return val;
}
*/