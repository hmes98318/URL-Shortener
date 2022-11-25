import path from 'path';
import dotenv from 'dotenv';

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import Url from './models/Url';

// import modules
import generatorUrl from './func/generatorUrl';




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
        dotenv.config({ path: path.resolve(__dirname, './environments/app.env') });

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
        this.app.set('views', path.join(__dirname, './views'));
/*
        this.app.all('*', (req, res, next) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "GET, POST");
            res.setHeader("Access-Control-Max-Age", "3600");
            res.setHeader("Access-Control-Allow-Headers", "x-requested-with,Authorization,token, content-type");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Content-type", "application/json; charset=UTF-8");

            next();
        })*/
    }

    private registerRoute(): void {
        this.app.get('/', (req, res) => {

            let resData = {
                name: null,
                key: null,
                newUrl: null
            };
            res.render('index', { data: resData });
        });

        this.app.post('/', this.urlencodedParser, (req, res) => {
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
                        newUrl: this.newUrlPrefix + newUrl.key
                    };

                    res.render("index", { data: resData });
                    console.log(resData);
                })
                .catch((err) => console.log(err));
        });

        this.app.get('/:key', (req, res) => {
            Url.findOne({ key: req.params.key }, (err: any, url: any) => {
                if (err) return console.error(err);

                if (!url) {
                    return res.redirect(this.redirectPrefix);
                }
                else {
                    return res.redirect(url.name);
                }
            });
        });

        // Undefined directory redirect to the root directory
        this.app.get('/*', (req, res) => {
            return res.redirect(this.redirectPrefix);
        });
    }
}
