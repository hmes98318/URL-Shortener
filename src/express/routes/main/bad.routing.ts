import { NextServer } from "next/dist/server/next";
import { RouteBase } from "../bases/route.bases";


export class BadRoute extends RouteBase {

    constructor(server:NextServer){
        super(server);
    }

    protected registerRoute(server:NextServer): void {
        this.router.get('/502', (req, res) => {
            return server.render(req, res, "/502");
        });
    }
}