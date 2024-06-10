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
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const google_auth_library_1 = require("google-auth-library");
const routerU = express_1.default.Router();
const prismaU = new client_1.PrismaClient();
const dotenv = require('dotenv');
dotenv.config();
const userSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1)
});
function insertUser(username, firstName, lastName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield prismaU.user.create({
                data: {
                    username,
                    firstName,
                    lastName
                }
            });
            console.log(res);
        }
        catch (error) {
            console.error('Error inserting user:', error);
            throw error;
        }
    });
}
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield prismaU.user.findMany();
            return users;
        }
        catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    });
}
routerU.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5172');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');
    const redirectUrl = 'http://localhost:5172/user';
    const oAuth2Client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent'
    });
    res.json({ url: authorizeUrl });
}));
function getUserdata(access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
        const data = yield response.json();
        console.log('data', data);
    });
}
routerU.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    if (typeof code !== 'string') {
        return res.status(400).send('Invalid code parameter');
    }
    try {
        const redirectUrl = 'http://localhost:5172/user';
        const oAuth2Client = new google_auth_library_1.OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
        const res = yield oAuth2Client.getToken(code);
        yield oAuth2Client.setCredentials(res.tokens);
        console.log("Tokens acquired");
        const user = oAuth2Client.credentials;
        yield (getUserdata(user.access_token));
    }
    catch (err) {
        res.json({ "msg": "Error Signing in with google" });
    }
}));
routerU.post('/fetchData', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield getAllUsers();
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ msg: 'Error fetching data' });
    }
}));
routerU.post('/signin', (req, res) => {
    // Implement signin logic here
    res.send('User signed in');
});
routerU.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, firstName, lastName } = req.body;
    // Convert username, firstName, and lastName to strings
    const usernameString = username.toString();
    const firstNameString = firstName.toString();
    const lastNameString = lastName.toString();
    // Validate the input
    const inputValidation = userSchema.safeParse({ username: usernameString, firstName: firstNameString, lastName: lastNameString });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: 'Inputs are not valid' });
    }
    try {
        // Insert the user into the database
        yield insertUser(usernameString, firstNameString, lastNameString);
        res.status(201).json({ msg: 'Admin created successfully' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error creating admin' });
    }
}));
routerU.post('/ItemsInCart/create', (req, res) => {
    // Implement create item in cart logic here
    res.send('Item added to cart');
});
routerU.get('/ItemsInCart/read', (req, res) => {
    // Implement read items from cart logic here
    res.send('Read items from cart');
});
routerU.delete('/ItemsInCart/delete', (req, res) => {
    // Implement delete item from cart logic here
    res.send('Item deleted from cart');
});
routerU.get('/order/*', (req, res) => {
    // Implement order handling logic here
    res.send('Order details');
});
routerU.get('/trackItems', (req, res) => {
    // Implement item tracking logic here
    res.send('Tracking items');
});
exports.default = routerU;
