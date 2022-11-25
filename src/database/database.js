"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor() {
        this.setEnvironment();
    }
    connect() {
        mongoose_1.default.connect(String(process.env.MONGO_URL))
            .then(() => console.log('mongodb connected!'))
            .catch(err => console.log('mongodb error: ' + err));
    }
    setEnvironment() {
        dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../environments/mongodb.env') });
    }
}
exports.Database = Database;
