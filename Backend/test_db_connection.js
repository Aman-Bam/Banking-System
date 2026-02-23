require("dotenv").config();
const mongoose = require("mongoose");

console.log("Testing connection to:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Successfully connected to DB");
        process.exit(0);
    })
    .catch(err => {
        console.error("Connection failed:", err);
        process.exit(1);
    });
