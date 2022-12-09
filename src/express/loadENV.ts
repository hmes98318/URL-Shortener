import path from 'path';
import dotenv from 'dotenv';


export class Env {

    constructor(){
        this.setEnvironment();
    }

    public node_env: boolean = true;
    public protocol: string = 'http';
    public hostname: string = 'localhost';
    public port: number = 5000;
    public urlPrefix: string = '';


    private setEnvironment(): void {
        dotenv.config({ path: path.resolve(__dirname, '../../environments/app.env') });

        this.node_env = String(process.env.NODE_ENV) !== 'production';
        this.protocol = String(process.env.PROTOCOL) || 'http';
        this.hostname = String(process.env.HOSTNAME) || 'localhost';
        this.port = Number(process.env.PORT) || 5000;

        const link = (this.port !== 80 && this.port !== 443)
            ? `${this.protocol}://${this.hostname}:${this.port}/`
            : `${this.protocol}://${this.hostname}/`;

        this.urlPrefix = link;
    }
}