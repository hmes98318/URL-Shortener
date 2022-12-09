import { NextServer } from "next/dist/server/next";
import { RouteBase } from "../bases/route.bases";

import { Env } from "../../loadEnv";
import Url from "../../../models/Url";


export class KeyRoute extends RouteBase {

    public urlPrefix: string = '';

    constructor(server: NextServer) {
        super(server);
        this.setEnvironment();
    }

    private setEnvironment(): void {
        const ENV = new Env();
        this.urlPrefix = ENV.urlPrefix;
    }

    protected registerRoute(server: NextServer): void {
        this.router.get('/:key', async (req, res) => {

            const shortKey = req.params.key;
            const shortUrlData = {
                key: shortKey
            };

            const urlInfo = await Url.findOne(shortUrlData)
                .catch((err) => {
                    console.error(err);
                    return server.render(req, res, "/502");
                });

            if (urlInfo != null) {
                return res.redirect(302, urlInfo.longUrl);
            }
            else {
                return res.redirect(this.urlPrefix);
            }
        });
    }
}