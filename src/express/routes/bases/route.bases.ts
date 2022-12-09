import { Router } from "express";
import { NextServer } from "next/dist/server/next";


export abstract class RouteBase {

    public router = Router();

    constructor(server: NextServer) {
        this.initial(server);
    }

    protected initial(server: NextServer): void {
        this.registerRoute(server);
    }

    protected abstract registerRoute(server: NextServer): void;
}