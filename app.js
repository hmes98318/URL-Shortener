import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import express from 'express';

import Url from './src/models/Url.js';
import config from './config.json' assert { type: "json" };

// import modules
import generatorUrl from './src/modules/generatorUrl.js';




const HOST = config.HOST;
const PORT = config.PORT;
const MONGO_URL = config.MONGO_URL;


let redirectPrefix = `${HOST}/`;
let newUrlPrefix = `${HOST}/`;

if (PORT !== 80 && PORT !== 443) {
    newUrlPrefix = `${HOST}:${PORT}/`;
    redirectPrefix = `${HOST}:${PORT}/`;
}




mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;


db.on('error', () => {
    console.log('mongodb error!');
});

db.once('open', () => {
    console.log('mongodb connected!');
});





const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));




app.get('/', (req, res) => {
    res.render('index');
})

app.post('/', (req, res) => {
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
        .then(user => {
            console.log(newUrl.key);
            res.redirect(`/new/${newUrl.key}`);
        })
        .catch(err => console.log(err));




    console.log(newUrl);
})




app.get('/new/:key', (req, res) => {
    Url.findOne({ key: req.params.key }, (err, url) => {
        if (err) return console.error(err)


        let newUrl = newUrlPrefix + url.key;
        let homePage = redirectPrefix;

        console.log('newUrl: ' + newUrl + '\nname: ' + url.name);

        return res.render('newurl', { url, newUrl, homePage });
    });
});



app.get('/:key', (req, res) => {
    Url.findOne({ key: req.params.key }, (err, url) => {
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