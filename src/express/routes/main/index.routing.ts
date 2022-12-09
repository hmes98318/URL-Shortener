import { NextServer } from "next/dist/server/next";
import { RouteBase } from "../bases/route.bases";


export class IdxRoute extends RouteBase {

    constructor(server: NextServer) {
        super(server);
    }

    protected registerRoute(server: NextServer): void {
        this.router.get('/', (req, res) => {
            return server.render(req, res, "/index");
        });
    }
}