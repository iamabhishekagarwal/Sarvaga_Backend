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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: "./../uploads/products/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
}).single("productImage");
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb("Error: Images Only!");
    }
}
const routerA = express_1.default.Router();
const prismaA = new client_1.PrismaClient();
routerA.use(express_1.default.json());
const adminSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    name: zod_1.z.string()
});
function insertAdmin(username, email, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield prismaA.admin.create({
                data: {
                    username,
                    email,
                    name,
                },
            });
            return res;
        }
        catch (error) {
            console.error("Error inserting user:", error);
            throw error;
        }
    });
}
function getAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield prismaA.product.findMany();
            return product;
        }
        catch (error) {
            console.error("Error fetching product by ID:", error);
            throw error;
        }
    });
}
function deleteProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prismaA.cartProduct.deleteMany({
                where: {
                    productId: id,
                },
            });
            const product = yield prismaA.product.delete({
                where: {
                    id,
                },
            });
            if (!product) {
                return null;
            }
            return product;
        }
        catch (error) {
            console.error("Error deleting product by ID:", error);
            throw error;
        }
    });
}
routerA.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ msg: err });
        }
        else {
            if (req.file == undefined) {
                res.status(400).json({ msg: "No file selected" });
            }
            else {
                res.status(200).json({
                    msg: "File uploaded",
                    filePath: `/uploads/products/${req.file.filename}`,
                });
            }
        }
    });
}));
function checkAdmin(username, email, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield prismaA.admin.findFirst({
                where: {
                    email,
                },
            });
            if (!res) {
                return { isAdmin: false };
            }
            return { isAdmin: true };
        }
        catch (error) {
            console.error("Error inserting user:", error);
            throw error;
        }
    });
}
;
function insertProduct(specialCategory, category, productName, description, fabric, color, price) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield prismaA.product.create({
                data: {
                    category,
                    productName,
                    description,
                    fabric,
                    color,
                    price,
                },
            });
            return res;
        }
        catch (error) {
            console.error("Error inserting product:", error);
            throw error;
        }
    });
}
function getSarees() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prismaA.product.findMany({
                where: {
                    category: "Saree",
                },
            });
            return data;
        }
        catch (error) {
            console.error("Error getting the request data: ", error);
            throw error;
        }
    });
}
function getSalwaars() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prismaA.product.findMany({
                where: {
                    category: "Salwaar",
                },
            });
            return data;
        }
        catch (error) {
            console.error("Error getting the request data: ", error);
            throw error;
        }
    });
}
function getLehangas() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield prismaA.product.findMany({
                where: {
                    category: "Lehanga",
                },
            });
            return data;
        }
        catch (error) {
            console.error("Error getting the request data: ", error);
            throw error;
        }
    });
}
routerA.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, name } = req.body;
    const inputValidation = adminSchema.safeParse({
        username,
        email,
        name,
    });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: "Inputs are not valid" });
    }
    try {
        const response = yield insertAdmin(username, email, name);
        res.status(201).json({ msg: "Admin created successfully", res: response });
    }
    catch (error) {
        res.status(500).json({ msg: "Error creating admin" });
    }
}));
routerA.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, name } = req.body;
    const inputValidation = adminSchema.safeParse({
        username,
        email,
        name,
    });
    if (!inputValidation.success) {
        return res.status(400).json({ msg: "Inputs are not valid" });
    }
    try {
        const response = yield checkAdmin(username, email, name);
        if (response.isAdmin) {
            res
                .status(201)
                .json({ msg: "Admin Verified Successfully", res: response });
        }
        else {
            res
                .status(400)
                .json({ msg: "Admin Access Denied", res: response });
        }
    }
    catch (error) {
        res.status(500).json({ msg: "Error Verifying admin" });
    }
}));
routerA.get("/products/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsArr = yield getAllProducts();
        if (productsArr) {
            res.json(productsArr);
        }
        else {
            res.status(400).json({ error: "Invalid product ID" });
        }
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products");
    }
}));
routerA.post("/products/addProducts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialCategory, category, productName, description, fabric, color, price, } = req.body;
    try {
        const newProduct = yield insertProduct(specialCategory, category, productName, description, fabric, color, price);
        res
            .status(201)
            .json({ message: "Product added successfully", product: newProduct });
    }
    catch (error) {
        console.error("Error adding product:", error);
        res
            .status(500)
            .json({ message: "Error adding product", error: error.message });
    }
}));
routerA.delete("/products/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const deletedProduct = yield deleteProductById(parseInt(id));
        if (!deletedProduct) {
            res.status(400).json({ msg: "Invalid ID" });
        }
        res
            .status(200)
            .json({ msg: "product deleted successfully", product: deletedProduct });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res
            .status(500)
            .json({ message: "Error deleting product", error: error.message });
    }
}));
routerA.put("/orders/*", (req, res) => {
    // Implement orders update logic here
    res.send("Orders update endpoint");
});
routerA.get("/stats/*", (req, res) => {
    // Implement stats retrieval logic here
    res.send("Stats endpoint");
});
exports.default = routerA;
