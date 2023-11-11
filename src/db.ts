import { Collection, CollectionInfo, MongoClient } from "mongodb";

const DB_URI = "mongodb+srv://nexusadmin:MuTd6TD77z7eE3R9@nexus.vyey684.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = 'Nexus';
const DB_COLLECTIONS = ["User", "Chat"] as const

const client = new MongoClient(DB_URI);

export const Collections: Partial<Record<typeof DB_COLLECTIONS[number], Collection>> = {}

const startDbConnection = async () => {
    try {
        await client.connect();
        await client.db(DB_NAME).command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.log("Error while starting db connection")
        console.log(error)
        throw error
    }
}

export const closeDbConnection = async () => {
    await client.close()
}

const cleanupCollections = async (collections: CollectionInfo[]) => {
    try {
        for(const collection of collections) {
            // @ts-expect-error
            const shouldBeDeleted = !DB_COLLECTIONS.includes(collection.name)
            if(shouldBeDeleted) await client.db(DB_NAME).dropCollection(collection.name)
        }
    } catch (error) {
        console.log("Error while cleaning up collections in MongoDB!")
        console.log(error)
        throw error
    }
}

const createCollections = async () => {
    try {
        const collections = await client.db(DB_NAME).listCollections().toArray()
        await cleanupCollections(collections)
        for(const name of DB_COLLECTIONS) {
            const exists = (collections).find(e => e.name === name)
            if(!exists) {
                Collections[name] = await client.db(DB_NAME).createCollection(name)
            }
        }
        console.log("Succesfully created collections in MongoDB!")
    } catch (error) {
        console.log("Error while creating collections")
        console.log(error)
        throw error
    }
}

export const initDb = async () => {
    await startDbConnection()
    await createCollections()
}




