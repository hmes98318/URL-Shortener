import { RouteBase } from "./bases/route.bases";
import { NextServer } from "next/dist/server/next";
import { BadRoute } from "./main/bad.routing";



export class AppRoute extends RouteBase {

    constructor(server:NextServer){
        super(server);
    }

    protected registerRoute(server:NextServer): void {

        const badRoute = new BadRoute(server);

        this.router.use('/502', badRoute.router);
    }
}