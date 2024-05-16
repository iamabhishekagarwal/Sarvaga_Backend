"use strict";
const RouterU = require("express");
const routerU = RouterU();
const zodU = require("zod");
const user = require("../Middlewares/userMiddleware");
const userSchema = zodU.object({
    username: zodU.coerce.string().email(),
    password: zodU.string().min(8)
});
routerU.post("/fetchData/*", (req, res) => {
});
routerU.post("/signin", (req, res) => {
});
routerU.post("/signup", (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    const inputValidation = userSchema.safeParse({ username: username, password: password });
    if (!inputValidation.success) {
        res.json({ msg: "Inputs are not valid" });
    }
    //create(Database)
    res.send("User created Successfully");
});
routerU.put("/forgotPwd", (req, res) => {
});
routerU.post("/ItemsToCart/create", (req, res) => {
});
routerU.get("/ItemsToCart/read", (req, res) => {
});
routerU.delete("/ItemsToCart/delete", (req, res) => {
});
routerU.get("/order/*", (req, res) => {
});
routerU.get("/trackItems", (req, res) => {
});
module.exports = routerU;
