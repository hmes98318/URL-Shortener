import path from 'path';
import dotenv from 'dotenv';

import mongoose from 'mongoose';


export class Database {

    constructor() {
        this.setEnvironment();
    }

    public connect(): void {
        mongoose.connect(String(process.env.MONGO_URL))
            .then(() => console.log('mongodb connected!'))
            .catch(err => console.log('mongodb error: ' + err));
    }

    private setEnvironment(): void {
        dotenv.config({ path: path.resolve(__dirname, '../../environments/mongodb.env') });
    }
}
