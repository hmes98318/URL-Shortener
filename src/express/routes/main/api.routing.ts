import { NextServer } from "next/dist/server/next";
import { RouteBase } from "../bases/route.bases";

import { Env } from "../../loadENV";
import Url from "../../../models/Url";
import generateKey from "../../generateKey";


export class ApiRoute extends RouteBase {

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
        this.router.post('/api', async (req, res) => {

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