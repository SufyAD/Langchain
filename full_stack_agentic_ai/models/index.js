import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose, { mongo } from "mongoose"

// dotenv configuration to be used inside index.js
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.arguments(cors())
app.arguments(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then((result) => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch((err) => {
        console.log(`MONGO Connection error ${err}`)
    });

