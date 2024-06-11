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
const routerU = express_1.default.Router();
const prismaU = new client_1.PrismaClient();
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
