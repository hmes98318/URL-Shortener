import bcrypt from 'bcryptjs';


let url = '';

type generatorUrl = (url: string) => string;
const generatorUrl: generatorUrl = (url: string) => {
    let cryptoUrl = '';
    cryptoUrl += bcrypt.hashSync(`${url}`, 10).slice(-5);

    if (cryptoUrl.includes('/') || cryptoUrl.includes('.')) {
        return generatorUrl(cryptoUrl);
    }
    else {
        return cryptoUrl;
    }
};
export default generatorUrl;