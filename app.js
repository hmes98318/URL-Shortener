"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const Url_1 = __importDefault(require("./src/models/Url"));
const config_json_1 = __importDefault(require("./config.json"));
// import modules
const generatorUrl_1 = __importDefault(require("./src/func/generatorUrl"));
const HOST = config_json_1.default.HOST;
const PORT = config_json_1.default.PORT;
const MONGO_URL = config_json_1.default.MONGO_URL;
let redirectPrefix = `${HOST}/`;
let newUrlPrefix = `${HOST}/`;
if (PORT !== 80 && PORT !== 443) {
    newUrlPrefix = `${HOST}:${PORT}/`;
    redirectPrefix = `${HOST}:${PORT}/`;
}
mongoose_1.default.connect(MONGO_URL);
const db = mongoose_1.default.connection;
db.on('error', (err) => {
    console.log('mongodb error: ' + err);
});
db.once('open', () => {
    console.log('mongodb connected!');
});
const app = (0, express_1.default)();
const urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    let resData = {
        name: null,
        key: null,
        newUrl: null
    };
    res.render('index', { data: resData });
});
app.post('/', urlencodedParser, (req, res) => {
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
            newUrl: newUrlPrefix + newUrl.key
        };
        res.render("index", { data: resData });
        console.log(resData);
    })
        .catch((err) => console.log(err));
});
app.get('/:key', (req, res) => {
    Url_1.default.findOne({ key: req.params.key }, (err, url) => {
        if (err)
            return console.error(err);
        if (!url) {
            return res.redirect(redirectPrefix);
        }
        else {
            return res.redirect(url.name);
        }
    });
});
app.get('/*', (req, res) => {
    return res.redirect(redirectPrefix);
});
app.listen(PORT, () => {
    console.log(`Server start listening: ${HOST}:${PORT}`);
});
