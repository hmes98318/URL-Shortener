import { NextServer } from "next/dist/server/next";
import { RouteBase } from "./bases/route.bases";

import { IdxRoute } from "./main/index.routing";
import { BadRoute } from "./main/bad.routing";
import { ApiRoute } from "./main/api.routing";
import { KeyRoute } from "./main/key.routing";


export class AppRoute extends RouteBase {

    constructor(server: NextServer) {
        super(server);
    }

    protected registerRoute(server: NextServer): void {

        const idxRoute = new IdxRoute(server);
        const badRoute = new BadRoute(server);
        const apiRoute = new ApiRoute(server);
        const keyRoute = new KeyRoute(server);

        this.router.use(idxRoute.router); //    /
        this.router.use(badRoute.router); //    /502
        this.router.use(apiRoute.router); //    /api
        this.router.use(keyRoute.router); //    /:key
    }
}