"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRoutes_1 = __importDefault(require("./Routes/adminRoutes")); // Assuming adminRoutes.ts is the correct filename
const userRoutes_1 = __importDefault(require("./Routes/userRoutes"));
const app = (0, express_1.default)();
const port = 5172;
app.use(express_1.default.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'application/json'], // Add other headers as needed
};
// Apply CORS options
// app.use(cors(corsOptions));
// Handle preflight requests for all routes
// app.options('*', cors(corsOptions));
app.use('/admin', adminRoutes_1.default);
app.use('/user', userRoutes_1.default);
app.listen(port, () => {
    console.log('Listening to port ' + port);
});
