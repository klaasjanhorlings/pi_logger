import { Database, RunResult } from "sqlite3";

const createDevicesTable = `CREATE TABLE IF NOT EXISTS "Devices" ( 
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT, 
    "Name" TEXT NOT NULL UNIQUE
);`;

const createEndpointsTable = `CREATE TABLE IF NOT EXISTS "Endpoints" ( 
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT, 
    "DeviceId" INTEGER NOT NULL, 
    "Name" TEXT NOT NULL UNIQUE,
    CONSTRAINT "FK_Endpoint_Devices_DeviceId"
        FOREIGN KEY ("DeviceId") REFERENCES "Devices" ("Id")
        ON DELETE CASCADE
);`;

const createReadingsTable = `CREATE TABLE IF NOT EXISTS "Readings" ( 
    "Id" INTEGER PRIMARY KEY AUTOINCREMENT, 
    "EndpointId" INTEGER, 
    "Timestamp" INTEGER, 
    "Value" NUMERIC,
    CONSTRAINT "FK_Readings_Endpoints_EndpointId"
        FOREIGN KEY ("EndpointId") REFERENCES "Endpoints" ("Id")
        ON DELETE CASCADE
);`;

export const createIfNotExists = async (db: Database) => {
    try {
        await createTable(db, createDevicesTable);
        await createTable(db, createEndpointsTable);
        await createTable(db, createReadingsTable);
    } catch(err) {
        console.log(err);
    }
}

const createTable = (db: Database, sql: string) => {
    return new Promise<Database>((resolve, reject) => {
        db.run(sql, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}
