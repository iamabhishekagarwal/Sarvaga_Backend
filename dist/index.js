"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRoutes_1 = __importDefault(require("./Routes/adminRoutes")); // Assuming adminRoutes.ts is the correct filename
const userRoutes_1 = __importDefault(require("./Routes/userRoutes")); // Assuming userRoutes.ts is the correct filename
const app = (0, express_1.default)();
const port = 5172;
app.use(express_1.default.json());
app.use('/admin', adminRoutes_1.default);
app.use('/user', userRoutes_1.default);
app.listen(port, () => {
    console.log('Listening to port ' + port);
});
