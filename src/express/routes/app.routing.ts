import { NextServer } from "next/dist/server/next";
import { RouteBase } from "./bases/route.bases";

import { BadRoute } from "./main/bad.routing";
import { IdxRoute } from "./main/index.routing";
import { ApiRoute } from "./main/api.routing";



export class AppRoute extends RouteBase {

    constructor(server: NextServer) {
        super(server);
    }

    protected registerRoute(server: NextServer): void {

        const idxRoute = new IdxRoute(server);
        const badRoute = new BadRoute(server);
        const apiRoute = new ApiRoute(server);

        this.router.use('/', idxRoute.router);
        this.router.use('/502', badRoute.router);
        this.router.use('/api', apiRoute.router);
    }
}