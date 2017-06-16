import { Database } from "sqlite3";

const createDevice = `INSERT INTO Devices (Name) VALUES (?)`;
const getDeviceId = `SELECT Id FROM Devices WHERE Name = ?`;
const listDevices = `SELECT Id, Name FROM Devices`;

interface DeviceModel {
    Id: number;
    Name: string;
}

export default class Devices {    
    static createDevice(db: Database, name: string) {
        return new Promise<number>((resolve, reject) => {
            db.run(createDevice, [name], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    static getDeviceId(db: Database, name: string) {
        return new Promise<number>((resolve, reject) => {
            db.get(getDeviceId, [name], function(err, row) {
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

    static listDevices(db: Database) {
        return new Promise<DeviceModel[]>((resolve, reject) => {
            db.all(listDevices, function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    } 
}
