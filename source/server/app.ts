import * as express from "express";
import * as sqlite from "sqlite3";
import log from "./logging";
import { createIfNotExists } from "./db/create-db";
import Devices from "./db/devices";
import Endpoints from "./db/endpoints";
import Readings from "./db/readings";

const app = express();
const db = new sqlite.Database("./db.db", (err) => {
    createIfNotExists(db);
});

app.route("/")
    .get((req, res) => {
        Devices.listDevices(db).then(devices => {
            log.info("Listing devices");
            res.send(JSON.stringify(devices));
        }, err => handleError(err, res));
    })
    .post((req, res) => {
        const { name } = JSON.parse(req.body);
        Devices.createDevice(db, name).then(id => {
            log.info(`New device added (name: ${name}, id: ${id})`);
            res.send(JSON.stringify({ id: id }));
        }, err => handleError(err, res));
    })
    .delete((req, res) => {
        
    });

app.route("/:deviceId(\\d+)")
    .get((req, res) => {
        const { deviceId } = req.params;
        Endpoints.listEndpoints(db, deviceId).then(endpoints => {
            log.info(`Listing endpoints for device ${deviceId}`);
            res.send(JSON.stringify(endpoints));
        }, err => handleError(err, res));
    })
    .post((req, res) => {
        const { deviceId, name } = JSON.parse(req.body);
        Endpoints.createEndpoint(db, deviceId, name).then(id => {
            log.info(`New endpoint added (name: ${name}, id: ${id})`);
            res.send(JSON.stringify({ id: id }));
        }, err => handleError(err, res))
    })
    .delete((req, res) => {
    
    });

app.route("/:deviceId(\\d+)/:endpointId(\\d+)")
    .get((req, res) => {
        const { deviceId, endpointId } = req.params;
        Readings.listReadings(db, endpointId, new Date, new Date).then(readings => {
            log.info(`Listing readings for endpoint ${endpointId}`);
            res.send(JSON.stringify(readings));
        }, err => handleError(err, res));
    })
    .post((req, res) => {
        const { value, timestamp } = JSON.parse(req.body);
        const { deviceId, endpointId } = req.params;
        Readings.createReading(db, endpointId, value, new Date(timestamp)).then(id => {
            log.info(`Reading added (endpointId: ${endpointId}, timestamp: ${timestamp}, value ${value}`);
        }, err => handleError(err, res));
    });

const handleError = (error, res) => {
    log.error(error);
    res.status(500);
    res.send({ error: error }); 
}

export default app;