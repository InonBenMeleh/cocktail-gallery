import {Cocktail} from "../components/cocktail/dashboard/useCocktails.tsx";
import {blobToDataURL} from "../utils/utils.ts";

class IndexDBManager {
    private static instance: IndexDBManager | null = null;
    private db: IDBDatabase | null = null;
    private dbName: string;
    private version: number;

    private constructor(dbName: string = "CocktailDB", version: number = 2) {
        this.dbName = dbName;
        this.version = version;
    }

    public static getInstance(dbName: string = "CocktailDB", version: number = 2): IndexDBManager {
        if (!IndexDBManager.instance) {
            IndexDBManager.instance = new IndexDBManager(dbName, version);
        }
        return IndexDBManager.instance;
    }

    private initializeDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains("Drinks")) {
                    const drinksStore = db.createObjectStore("Drinks", { keyPath: "id" });
                    drinksStore.createIndex("strDrink", "name", { unique: false });
                }
                if (!db.objectStoreNames.contains("Images")) {
                    db.createObjectStore("Images", { keyPath: "id" });
                }
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log("Database initialized successfully");
                resolve();
            };

            request.onerror = () => {
                console.error("Database initialization failed:", request.error);
                reject(request.error);
            };
        });
    }

    private async ensureDBInitialized() {
        if (!this.db) {
            await this.initializeDB();
        }
    }

    async addCocktail(cocktail: Cocktail): Promise<void> {
        await this.ensureDBInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction("Drinks", "readwrite");
            const store = transaction.objectStore("Drinks");
            const request = store.add(cocktail);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getCocktailById(id: string): Promise<Cocktail | undefined> {
        await this.ensureDBInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction("Drinks", "readonly");
            const store = transaction.objectStore("Drinks");
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addImage(storeName: string, id: string, imageBlob: Blob): Promise<void> {
        await this.ensureDBInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);

            const cocktailImage = {
                id: id,
                imageSrc: imageBlob
            };

            const request = store.put(cocktailImage);
            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e);
        });
    }

    async getImage(storeName: string, id: string): Promise<string | null> {
        await this.ensureDBInitialized();

        return new Promise(async (resolve, reject) => {
            const transaction = this.db!.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            request.onsuccess = async (event) => {
                const target = event.target as IDBRequest;
                const result = target.result;
                if (result && result.imageSrc) {
                    try {
                        const dataURL = await blobToDataURL(result.imageSrc);
                        resolve(dataURL);
                    } catch (error) {
                        reject("Failed to convert Blob to Data URL");
                    }
                } else {
                    resolve(null);
                }
            };
            request.onerror = (e) => reject(e);
        });
    }

    public async isEmpty(storeName: string): Promise<boolean> {
        await this.ensureDBInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result.length === 0);
            };

            request.onerror = () => reject("Error checking if store is empty");
        });
    }

    async getAllCocktails(): Promise<Cocktail[]> {
        await this.ensureDBInitialized();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction("Drinks", "readonly");
            const store = transaction.objectStore("Drinks");
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(new Error("Failed to retrieve cocktails from the database"));
        });
    }
}

export default IndexDBManager;
