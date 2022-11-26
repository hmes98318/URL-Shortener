"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const Url_1 = __importDefault(require("../models/Url"));
// import modules
const generatorUrl_1 = __importDefault(require("../func/generatorUrl"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
        this.redirectPrefix = '';
        this.newUrlPrefix = '';
        this.setEnvironment();
        //this.setHelmet();
        this.setEJS();
        this.registerRoute();
    }
    /**
     * start express framework
     */
    bootloader() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server start listening: ${process.env.HOST}:${process.env.PORT}`);
        });
    }
    /**
     * -------------------------------------------
     * Private Methods
     * -------------------------------------------
     */
    setEnvironment() {
        dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../src/environments/app.env') });
        let host = process.env.HOST;
        let port = Number(process.env.PORT);
        this.redirectPrefix = port !== 80 && port !== 443 ? `${host}:${port}/` : `${host}/`;
        this.newUrlPrefix = port !== 80 && port !== 443 ? `${host}:${port}/` : `${host}/`;
    }
    setHelmet() {
        //this.app.use(helmet());
    }
    setEJS() {
        this.app.set('view engine', 'ejs');
        this.app.set('views', path_1.default.join(__dirname, '../../src/views'));
        /*
                this.app.all('*', (req, res, next) => {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
                    res.setHeader("Access-Control-Max-Age", "3600");
                    res.setHeader("Access-Control-Allow-Headers", "x-requested-with,Authorization,token, content-type");
                    res.setHeader("Access-Control-Allow-Credentials", "true");
                    res.setHeader("Content-type", "application/json; charset=UTF-8");
        
                    next();
                })*/
    }
    registerRoute() {
        this.app.get('/', (req, res) => {
            let resData = {
                name: null,
                key: null,
                newUrl: null
            };
            res.render('index', { data: resData });
        });
        this.app.post('/', this.urlencodedParser, (req, res) => {
            let fullUrl = req.body.fullUrl;
            let key = (0, generatorUrl_1.default)(fullUrl);
            const newUrl = new Url_1.default({
                name: fullUrl,
                key: key
            });
            newUrl
                .save( /* (err, result)=> {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result);
                }
            }*/)
                .then(() => {
                let resData = {
                    name: newUrl.name,
                    key: newUrl.key,
                    newUrl: this.newUrlPrefix + newUrl.key
                };
                res.render("index", { data: resData });
                console.log(resData);
            })
                .catch((err) => console.log(err));
        });
        this.app.get('/:key', (req, res) => {
            Url_1.default.findOne({ key: req.params.key }, (err, url) => {
                if (err)
                    return console.error(err);
                if (!url) {
                    return res.redirect(this.redirectPrefix);
                }
                else {
                    return res.redirect(url.name);
                }
            });
        });
        // Undefined directory redirect to the root directory
        this.app.get('/*', (req, res) => {
            return res.redirect(this.redirectPrefix);
        });
    }
}
exports.App = App;
