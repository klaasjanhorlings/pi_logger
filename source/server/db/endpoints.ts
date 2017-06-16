import { Database } from "sqlite3";

const createEndpoint = `INSERT INTO Endpoints (DeviceId, Name) VALUES (?, ?)`;
const getEndpointId = `SELECT EndpointId FROM Endpoints WHERE Name = ?`;
const listEndpoints = `SELECT Id, Name FROM Endpoints WHERE DeviceId = ?`;

interface EndpointModel {
    Id: number;
    Name: string;
}

export default class EndPoints {
    static createEndpoint(db: Database, deviceId: number, name: string) {
        return new Promise<number>((resolve, reject) => {
            db.run(createEndpoint, [deviceId, name], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    static getEndpointId(db: Database, name: string) {
        return new Promise<number>((resolve, reject) => {
            db.get(getEndpointId, [name], function(err, row) {
                if (err) {
                    reject(err);
                } else {
                    if (row == null) {
                        resolve();
                    } else {
                        resolve(row["Id"]);
                    }
                }
            });
        });
    }

    static listEndpoints(db: Database, deviceId: number) {
        return new Promise<EndpointModel[]>((resolve, reject) => {
            db.all(listEndpoints, [deviceId], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    } 
}