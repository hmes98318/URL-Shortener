"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./src/database/database");
const app_1 = require("./src/app");
const startDatabase = () => {
    const database = new database_1.Database();
    database.connect();
};
const startApp = () => {
    const app = new app_1.App();
    app.bootloader();
};
startDatabase();
startApp();
