import { Database } from './database/database'
import { App } from './app/app';



const startDatabase = () => {
    const database = new Database();
    database.connect();
}


const startApp = () => {
    const app = new App();
    app.bootloader();
}


startDatabase();
startApp();

