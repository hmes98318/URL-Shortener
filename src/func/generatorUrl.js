import bcrypt from 'bcryptjs';


let url = '';

export default (url) => {
    let cryptoUrl = '';
    cryptoUrl += bcrypt.hashSync(`${url}`, 10).slice(-5);

    if (cryptoUrl.includes('/', '.')) {
        return generatorUrl(cryptoUrl);
    }
    else {
        return cryptoUrl;
    }
};