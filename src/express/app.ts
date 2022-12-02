import path from 'path';
import dotenv from 'dotenv';

import next from "next";
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import Url from '../models/Url';

// import modules
import generateKey from '../func/generateKey';




export class App {

    constructor() {
        this.setEnvironment();
        this.registerRoute();
    }

    private protocol: string = 'http';
    private hostname: string = 'localhost';
    private port: number = 5000;

    private urlPrefix: string = '';
    private newUrlPrefix: string = '';
    private dev: boolean = true;

    private server = next({ dev: this.dev, hostname: this.hostname, port: this.port });

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
        dotenv.config({ path: path.resolve(__dirname, '../../src/environments/app.env') });

        this.protocol = String(process.env.PROTOCOL);
        this.hostname = String(process.env.HOSTNAME);
        this.port = Number(process.env.PORT);
        this.dev = process.env.NODE_ENV !== "production";

        const link = (this.port !== 80 && this.port !== 443)
            ? `${this.protocol}://${this.hostname}:${this.port}/`
            : `${this.protocol}://${this.hostname}/`;

        this.urlPrefix = link;
        this.newUrlPrefix = link;
    }

    private setHelmet(): void {
        //app.use(helmet());
    }

    private setNEXT(): void {
    }

    private registerRoute(): void {
        this.server.prepare().then(() => {

            const handle = this.server.getRequestHandler();


            this.app.get('/', (req, res) => {
                return this.server.render(req, res, "/index");
            });

            this.app.get('/502', (req, res) => {
                return this.server.render(req, res, "/502");
            });

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
                        shortUrl: this.newUrlPrefix + key
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
