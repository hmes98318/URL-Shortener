const availableChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

type generateKey = (length: number) => string;
const generateKey: generateKey = (length: number) => {

    let cryptoUrl = '';

    for(var i = 0; i < length; i++){
        cryptoUrl += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
    }

    return cryptoUrl;
};
export default generateKey;