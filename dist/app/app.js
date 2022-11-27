"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const generateKey_1 = __importDefault(require("../func/generateKey"));
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
        this.app.set('views', path_1.default.join(__dirname, '../../views'));
    }
    registerRoute() {
        this.app.get('/', (req, res) => {
            let emptyData = {
                name: null,
                key: null,
                newUrl: null
            };
            return res.render('index', { data: emptyData });
        });
        this.app.post('/', this.urlencodedParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const fullUrl = req.body.fullUrl;
            const longUrlData = {
                longUrl: fullUrl
            };
            let urlInfo = yield Url_1.default.findOne(longUrlData)
                .catch((err) => {
                console.error(err);
                return res.render('502');
            });
            if (urlInfo == null) {
                let key = '';
                do {
                    key = (0, generateKey_1.default)(5);
                    urlInfo = yield Url_1.default.findOne({ key: key });
                } while (urlInfo !== null);
                const newData = {
                    key: key,
                    longUrl: fullUrl,
                    shortUrl: this.newUrlPrefix + key
                };
                const shortenerData = new Url_1.default(newData);
                shortenerData
                    .save()
                    .catch((err) => {
                    console.error(err);
                    return res.render('502');
                });
                return res.render('index', { data: newData });
            }
            return res.render('index', { data: urlInfo });
        }));
        this.app.get('/:key', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const shortKey = req.params.key;
            const shortUrlData = {
                key: shortKey
            };
            const urlInfo = yield Url_1.default.findOne(shortUrlData)
                .catch((err) => {
                console.error(err);
                return res.render('502');
            });
            if (urlInfo != null) {
                return res.redirect(302, urlInfo.longUrl);
            }
            else {
                return res.redirect(this.redirectPrefix);
            }
        }));
        // Undefined directory redirect to the root directory
        this.app.get('/*', (req, res) => {
            return res.redirect(this.redirectPrefix);
        });
    }
}
exports.App = App;
