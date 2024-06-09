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
const routerA = express_1.default.Router();
const prismaA = new client_1.PrismaClient();
const adminSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1)
});
function insertAdmin(username, firstName, lastName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield prismaA.user.create({
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
function insertProduct(category, productName, description, fabric, color, price) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield prismaA.product.create({
                data: {
                    category,
                    productName,
                    description,
                    fabric,
                    color,
                    price
                }
            });
            return res;
        }
        catch (error) {
            console.error('Error inserting product:', error);
            throw error;
        }
    });
}
routerA.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, firstName, lastName } = req.body;
    const inputValidation = adminSchema.safeParse({ username, firstName, lastName });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: 'Inputs are not valid' });
    }
    try {
        yield insertAdmin(username, firstName, lastName);
        res.status(201).json({ msg: 'Admin created successfully' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error creating admin' });
    }
}));
routerA.post('/signin', (req, res) => {
    // Implement signin logic here
    res.send('Signin endpoint');
});
routerA.post('/products/addProducts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, productName, description, fabric, color, price } = req.body;
    try {
        const newProduct = yield insertProduct(category, productName, description, fabric, color, price);
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    }
    catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
}));
routerA.put('/orders/*', (req, res) => {
    // Implement orders update logic here
    res.send('Orders update endpoint');
});
routerA.get('/stats/*', (req, res) => {
    // Implement stats retrieval logic here
    res.send('Stats endpoint');
});
exports.default = routerA;
