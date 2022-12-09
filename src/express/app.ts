import path from 'path';
import dotenv from 'dotenv';

import next from "next";
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import Url from '../models/Url';
import { Env } from './loadENV';

// import modules
import generateKey from './generateKey';
import { AppRoute } from './routes/app.routing';
import { BadRoute } from './routes/main/bad.routing';




export class App {

    constructor() {
        this.setEnvironment();
        this.registerRoute();
    }

    private protocol: string = 'http';
    private hostname: string = 'localhost';
    private port: number = 5000;

    public urlPrefix: string = '';

    private server = next({ dev: process.env.NODE_ENV !== "production" });

    private urlEncodedParser = bodyParser.urlencoded({ extended: false });
    private jsonEncodeParser = bodyParser.json();

    private app = express();




    /**
     * start express framework
     */
    public bootloader(): void {
        this.app.listen(this.port, () => {
            console.log(`Server start listening: ${this.protocol}://${this.hostname}:${this.port}`);
        });
    }

    /** 
     * -------------------------------------------
     * Private Methods
     * -------------------------------------------
     */

    private setEnvironment(): void {
        const ENV = new Env();

        this.protocol = ENV.protocol;
        this.hostname = ENV.hostname;
        this.port = ENV.port;
    }

    private setHelmet(): void {
        //app.use(helmet());
    }

    private setNEXT(): void {
    }


    private registerRoute(): void {
        const route = new AppRoute(this.server);
        this.server.prepare().then(() => {

            const handle = this.server.getRequestHandler();

/*
            this.app.get('/', (req, res) => {
                return this.server.render(req, res, "/index");
            });
*//*
            this.app.get('/502', (req, res) => {
                return this.server.render(req, res, "/502");
            });
*/
            this.app.use(this.urlEncodedParser);
            this.app.use(this.jsonEncodeParser);
            this.app.use(route.router);


/*
            this.app.post('/api', this.urlEncodedParser, this.jsonEncodeParser, async (req, res) => {

                const { fullUrl } = JSON.parse(req.body.data);
                const longUrlData = {
                    longUrl: fullUrl
                }

                let urlInfo = await Url.findOne(longUrlData)
                    .catch((err) => {
                        console.error(err);
                        return this.server.render(req, res, "/502");
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
                        shortUrl: this.urlPrefix + key
                    };

                    const shortenerData = new Url(newData);
                    shortenerData
                        .save()
                        .catch((err) => {
                            console.error(err);
                            return this.server.render(req, res, "/502");
                        });

                    return res.status(201).json({
                        success: true,
                        data: newData
                    });
                }

                return res.status(201).json({
                    success: true,
                    data: urlInfo
                });
            });
            */

            this.app.get('/:key', this.urlEncodedParser, async (req, res) => {

                const shortKey = req.params.key;
                const shortUrlData = {
                    key: shortKey
                };

                const urlInfo = await Url.findOne(shortUrlData)
                    .catch((err) => {
                        console.error(err);
                        return this.server.render(req, res, "/502");
                    });

                if (urlInfo != null) {
                    return res.redirect(302, urlInfo.longUrl);
                }
                else {
                    return res.redirect(this.urlPrefix);
                }
            });


            this.app.get("*", (req, res) => {
                return handle(req, res);
            });
        })
            .catch((err) => {
                console.error(err);
            })


    }
}
