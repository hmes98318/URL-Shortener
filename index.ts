import { Database } from './src/database/database'
import { App } from './src/app';



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

