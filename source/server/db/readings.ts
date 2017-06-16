import { Database } from "sqlite3";

const createReading = `INSERT INTO Readings (EndpointId, Name, Timestamp) VALUES (?, ?, ?)`;
const listReadings = `SELECT Timestamp, Value FROM Readings 
        WHERE EndpointId = ? AND Timestamp > ? AND Timestamp < ?`

interface ReadingModel {
    Timestamp: number;
    Value: number;
}

export default class Readings {
    static createReading(db: Database, endpointId: number, value: number, timestamp: Date) {
        return new Promise<number>((resolve, reject) => {
            db.run(createReading, [endpointId, value, timestamp], function(err) {
                if(err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        })
    }

    static listReadings(db: Database, endpointId: number, start: Date, end: Date) {
        return new Promise<ReadingModel[]>((resolve, reject) => {
            db.all(listReadings, [endpointId, start.valueOf(), end.valueOf()], function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}