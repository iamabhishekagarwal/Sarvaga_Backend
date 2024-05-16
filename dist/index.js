"use strict";
const express = require("express");
const app = express();
const port = 3000;
const adminRoutes = require("./Routes/adminRoutes");
const userRoutes = require("./Routes/userRoutes");
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.listen(port, () => {
    console.log("Listening to port " + port);
});
