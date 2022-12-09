import next from "next";
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import { Env } from './loadENV';
import { AppRoute } from './routes/app.routing';


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

    private registerRoute(): void {

        const route = new AppRoute(this.server);

        this.server.prepare().then(() => {

            const handle = this.server.getRequestHandler();

            this.app.use(this.urlEncodedParser);
            this.app.use(this.jsonEncodeParser);
            this.app.use(route.router); // call app.routing


            this.app.get("*", (req, res) => {
                return handle(req, res);
            });
        })
            .catch((err) => {
                console.error(err);
            })
    }
}