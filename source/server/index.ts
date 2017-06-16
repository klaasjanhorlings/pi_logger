
import * as express from "express";
import * as sqlite from "sqlite3";
import log from "./logging";
import app from "./app";

const server = app.listen(80, () => {
    const address = server.address();
    log.info(`Server started listening at ${address.address}:${address.port}`);
});