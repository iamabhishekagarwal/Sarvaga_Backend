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
const dotenv_1 = __importDefault(require("dotenv"));
const routerU = express_1.default.Router();
const prismaU = new client_1.PrismaClient();
dotenv_1.default.config();
const userSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
});
function insertUser(username, firstName, lastName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield prismaU.user.create({
                data: {
                    username,
                    firstName,
                    lastName,
                },
            });
            console.log(res);
        }
        catch (error) {
            console.error("Error inserting user:", error);
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
            console.error("Error getting all users:", error);
            throw error;
        }
    });
}
function getProductByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prismaU.product.findUnique({
                where: {
                    id: Number(id), // Ensure the ID is a number
                },
            });
            return data;
        }
        catch (error) {
            console.error('Error fetching product by ID:', error);
            throw error;
        }
    });
}
function getProductsByCategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prismaU.product.findMany({
                where: { category },
            });
            return data;
        }
        catch (error) {
            console.error(`Error getting ${category} products:`, error);
            throw error;
        }
    });
}
const insertItem = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cart = yield prismaU.cart.findFirst({
            where: { ownerId: userId },
            include: { cartProducts: true },
        });
        if (!cart) {
            cart = yield prismaU.cart.create({
                data: {
                    ownerId: userId,
                    cartProducts: {
                        create: [{ productId }],
                    },
                },
                include: { cartProducts: true },
            });
        }
        else {
            const existingCartProduct = cart.cartProducts.find((cp) => cp.productId === productId);
            if (!existingCartProduct) {
                cart = yield prismaU.cart.update({
                    where: { id: cart.id },
                    data: {
                        cartProducts: {
                            create: [{ productId }],
                        },
                    },
                    include: { cartProducts: { include: { product: true } } },
                });
            }
        }
        const updatedCart = yield prismaU.cart.findUnique({
            where: { id: cart.id },
            include: { cartProducts: { include: { product: true } } },
        });
        return updatedCart;
    }
    catch (error) {
        throw error;
    }
});
const getItems = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cart = yield prismaU.cart.findFirst({
            where: { ownerId: userId },
            include: { cartProducts: true },
        });
        if (!cart) {
            cart = yield prismaU.cart.create({
                data: {
                    ownerId: userId,
                    cartProducts: {
                        create: [],
                    },
                },
                include: { cartProducts: { include: { product: true } } },
            });
        }
        return cart.cartProducts;
    }
    catch (error) {
        throw error;
    }
});
const deleteItems = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let cart = yield prismaU.cart.findFirst({
            where: { ownerId: userId },
            include: { cartProducts: true },
        });
        if (!cart) {
            console.log("Cart not found");
            return;
        }
        const cartProduct = cart.cartProducts.find((cp) => cp.productId === productId);
        if (cartProduct) {
            yield prismaU.cartProduct.delete({
                where: {
                    id: cartProduct.id,
                },
            });
            console.log("Product removed from cart");
        }
        else {
            console.log("Product not found in cart");
        }
    }
    catch (error) {
        console.error("Error deleting item from cart:", error);
        throw error;
    }
});
routerU.get("/fetchData", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield getAllUsers();
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ msg: "Error fetching data" });
    }
}));
routerU.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, firstName, lastName } = req.body;
    const inputValidation = userSchema.safeParse({
        username,
        firstName,
        lastName,
    });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: "Inputs are not valid" });
    }
    try {
        yield insertUser(username, firstName, lastName);
        res.status(201).json({ msg: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ msg: "Error creating user" });
    }
}));
routerU.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const data = yield getProductByID(id);
        res.json(data);
    }
    catch (error) {
        res.status(500).send(`Error fetching ${id} products`);
    }
}));
routerU.get("/products/:category", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.params.category;
    try {
        const data = yield getProductsByCategory(category);
        res.json(data);
    }
    catch (error) {
        res.status(500).send(`Error fetching ${category} products`);
    }
}));
routerU.post("/carts/additem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        const response = yield insertItem(userId, productId);
        res.json(response);
    }
    catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
}));
routerU.get("/carts/getItems", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const response = yield getItems(userId);
        res.json(response);
    }
    catch (error) {
        console.error("Error getting item from cart:", error);
        res.status(500).json({ error: "Failed to get item from cart" });
    }
}));
routerU.delete("/ItemsInCart/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId } = req.body;
        const response = yield deleteItems(userId, productId);
        res.json(response);
    }
    catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
}));
routerU.get("/order/*", (req, res) => {
    // Implement order handling logic here
    res.send("Order details");
});
routerU.get("/trackItems", (req, res) => {
    // Implement item tracking logic here
    res.send("Tracking items");
});
exports.default = routerU;
