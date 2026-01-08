"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
const errorMessage = `Index 00006: ✅
Index 00007: ✅
Index 00008: ✅
Index 00009: ✅
Index 00010: ✅
Index 00011: ✅
Index 00012: ❌ Country key XX is not defined
Index 00013: ❌ Postal code 12345678 must have the length 5
Index 00014: ✅
Index 00015: ❌ Please enter a valid email address.|Email address prinz#bayer.de is invalid`;
app.use(express_1.default.json());
app.get('/', async (req, res) => {
    const params = req.query;
    processWebhook(params, res);
});
app.post('/', async (req, res) => {
    const body = req.body;
    processWebhook(body, res);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
async function processWebhook(content, res) {
    console.debug(new Date().toISOString());
    // console.debug(JSON.stringify(content, null, 2));
    saveToFile(content, `dqa_${new Date().toISOString()}.json`);
    const DELAY = 1_000;
    console.debug(`Waiting ${DELAY / 1000}s...`);
    await new Promise(resolve => setTimeout(resolve, DELAY));
    console.debug('Done waiting');
    // res.send('Hello World!');
    // res.status(400).send('custom export error');
    res.status(400).send(errorMessage);
}
function saveToFile(content, filename) {
    console.debug(`Saving to file ${filename}`);
    console.debug(__dirname);
    fs.writeFileSync(path_1.default.join('C:/Users', os_1.default.userInfo().username, 'Desktop', filename), 
    // path.join(__dirname, filename),
    JSON.stringify(content, null, 2));
}
