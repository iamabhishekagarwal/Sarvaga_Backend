"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config")); // Assuming this is the correct import
function Admin(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ msg: 'No token provided' });
    }
    else {
        const words = token.split(' ');
        const jwtToken = words[1];
        try {
            const decodeValue = jsonwebtoken_1.default.verify(jwtToken, config_1.default);
            if (decodeValue.username) {
                next();
            }
            else {
                res.status(403).json({ msg: 'You are not authenticated' });
            }
        }
        catch (error) {
            res.status(403).json({ msg: 'Invalid token' });
        }
    }
}
exports.default = Admin;
