import path from 'path';
import dotenv from 'dotenv';

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import Url from '../models/Url';

// import modules
import generateKey from '../func/generateKey';




export class App {

    private app = express();
    private urlencodedParser = bodyParser.urlencoded({ extended: false });

    private redirectPrefix: string = '';
    private newUrlPrefix: string = '';

    constructor() {
        this.setEnvironment();
        //this.setHelmet();
        this.setEJS();
        this.registerRoute();
    }


    /**
     * start express framework
     */
    public bootloader(): void {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server start listening: ${process.env.HOST}:${process.env.PORT}`);
        });
    }

    /** 
     * -------------------------------------------
     * Private Methods
     * -------------------------------------------
     */

    private setEnvironment(): void {
        dotenv.config({ path: path.resolve(__dirname, '../../src/environments/app.env') });

        let host = process.env.HOST;
        let port = Number(process.env.PORT);

        this.redirectPrefix = port !== 80 && port !== 443 ? `${host}:${port}/` : `${host}/`;
        this.newUrlPrefix = port !== 80 && port !== 443 ? `${host}:${port}/` : `${host}/`;
    }

    private setHelmet(): void {
        //this.app.use(helmet());
    }

    private setEJS(): void {
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, '../../views'));
    }

    private registerRoute(): void {
        this.app.get('/', (req, res) => {

            let emptyData = {
                name: null,
                key: null,
                newUrl: null
            };
            return res.render('index', { data: emptyData });
        });

        this.app.post('/', this.urlencodedParser, async (req, res) => {

            const fullUrl = req.body.fullUrl;
            const longUrlData = {
                longUrl: fullUrl
            }

            let urlInfo = await Url.findOne(longUrlData)
                .catch((err) => {
                    console.error(err);
                    return res.render('502');
                });


            if (urlInfo == null) {
                let key = '';

                do {
                    key = generateKey(5);
                    urlInfo = await Url.findOne({ key: key });
                } while (urlInfo !== null);


                const newData = {
                    key: key,
                    longUrl: fullUrl,
                    shortUrl: this.newUrlPrefix + key
                };

                const shortenerData = new Url(newData);
                shortenerData
                    .save()
                    .catch((err) => {
                        console.error(err);
                        return res.render('502');
                    });

                return res.render('index', { data: newData });
            }

            return res.render('index', { data: urlInfo });
        });

        this.app.get('/:key', async (req, res) => {

            const shortKey = req.params.key;
            const shortUrlData = {
                key: shortKey
            };

            const urlInfo = await Url.findOne(shortUrlData)
                .catch((err) => {
                    console.error(err);
                    return res.render('502');
                });

            if (urlInfo != null) {
                return res.redirect(302, urlInfo.longUrl);
            }
            else {
                return res.redirect(this.redirectPrefix);
            }
        });


        // Undefined directory redirect to the root directory
        this.app.get('/*', (req, res) => {
            return res.redirect(this.redirectPrefix);
        });
    }
}
