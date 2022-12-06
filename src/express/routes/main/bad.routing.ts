import { RouteBase } from "../bases/route.bases";
import { NextServer } from "next/dist/server/next";


export class BadRoute extends RouteBase {

    constructor(server:NextServer){
        super(server);
    }

    protected registerRoute(server:NextServer): void {
        this.router.get('/', (req, res) => {
            return server.render(req, res, "/502");
        });
    }
}