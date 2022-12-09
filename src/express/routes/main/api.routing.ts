import { RouteBase } from "../bases/route.bases";
import { NextServer } from "next/dist/server/next";

import generateKey from "../../generateKey";
import Url from "../../../models/Url";
import bodyParser from 'body-parser';
import { App } from "../../app";
import { Env } from "../../loadENV";


export class ApiRoute extends RouteBase {

    private urlEncodedParser = bodyParser.urlencoded({ extended: false });
    private jsonEncodeParser = bodyParser.json();

    public urlPrefix: string = '';

    constructor(server:NextServer){
        super(server);
        this.setEnvironment();
    }

    private setEnvironment():void{
        const ENV = new Env();

        this.urlPrefix = ENV.urlPrefix;
    }

    protected registerRoute(server:NextServer) {
        this.router.post('/', async (req, res) => {

            const { fullUrl } = JSON.parse(req.body.data);
            const longUrlData = {
                longUrl: fullUrl
            }

            let urlInfo = await Url.findOne(longUrlData)
                .catch((err) => {
                    console.error(err);
                    return server.render(req, res, "/502");
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
                        return server.render(req, res, "/502");
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
    }
}