"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const availableChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateKey = (length) => {
    let cryptoUrl = '';
    for (var i = 0; i < length; i++) {
        cryptoUrl += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
    }
    return cryptoUrl;
};
exports.default = generateKey;
