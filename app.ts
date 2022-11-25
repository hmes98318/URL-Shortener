import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import express from 'express';

import Url from './src/models/Url';
import config from './config.json';

// import modules
import generatorUrl from './src/func/generatorUrl';




const HOST = config.HOST;
const PORT = config.PORT;
const MONGO_URL = config.MONGO_URL;


let redirectPrefix = `${HOST}/`;
let newUrlPrefix = `${HOST}/`;

if (PORT !== 80 && PORT !== 443) {
    newUrlPrefix = `${HOST}:${PORT}/`;
    redirectPrefix = `${HOST}:${PORT}/`;
}



mongoose.connect(MONGO_URL);
const db = mongoose.connection;


db.on('error', (err) => {
    console.log('mongodb error: ' + err);
});

db.once('open', () => {
    console.log('mongodb connected!');
});





const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');




app.get('/', (req, res) => {

    let resData = {
        name: null,
        key: null,
        newUrl: null
    };
    res.render('index', { data: resData });
});

app.post('/', urlencodedParser, (req, res) => {
    let fullUrl = req.body.fullUrl;
    let key = generatorUrl(fullUrl);

    const newUrl = new Url({
        name: fullUrl,
        key: key
    });


    newUrl
        .save(/* (err, result)=> {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
            }
        }*/)
        .then(() => {

            let resData = {
                name: newUrl.name,
                key: newUrl.key,
                newUrl: newUrlPrefix + newUrl.key
            };

            res.render("index", { data: resData });
            console.log(resData);
        })
        .catch((err) => console.log(err));
});


app.get('/:key', (req, res) => {
    Url.findOne({ key: req.params.key }, (err: any, url: any) => {
        if (err) return console.error(err);

        if (!url) {
            return res.redirect(redirectPrefix);
        }
        else {
            return res.redirect(url.name);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server start listening: ${HOST}:${PORT}`);
});