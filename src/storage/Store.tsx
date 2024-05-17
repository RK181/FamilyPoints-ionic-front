import { Storage, Drivers } from "@ionic/storage";

export const ConnectDB = async (name: string) => {

    const storage = new Storage({
        name,
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    });

    storage.create();
    return storage;
}