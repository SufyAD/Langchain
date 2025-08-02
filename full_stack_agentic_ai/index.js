import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

// dotenv configuration to be used inside index.js
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then((result) => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`MONGO Connection error ${err}`)
    });

