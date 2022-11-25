"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
let url = '';
const generatorUrl = (url) => {
    let cryptoUrl = '';
    cryptoUrl += bcryptjs_1.default.hashSync(`${url}`, 10).slice(-5);
    if (cryptoUrl.includes('/') || cryptoUrl.includes('.')) {
        return generatorUrl(cryptoUrl);
    }
    else {
        return cryptoUrl;
    }
};
exports.default = generatorUrl;
