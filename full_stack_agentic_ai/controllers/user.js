////////////////////////////////////////////////////
// Designer     : Sufyan
// Date         : 2025-08-01
// Description  : These are signup, login, and logout controllers
//                fired with the help of Inngest serverless API
////////////////////////////////////////////////////

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { inngest } from "../inngest/client.js";

/////////////////////////////////////////////////////
// Singup
/////////////////////////////////////////////////////
export const signup = async(req, res) => {
    const { email, password, skills } = req.body;
    try {
        // 1. Hash the password
        const hashed_pass = await bcrypt.hash(password, 10);

        // 2. Create user in database
        const user = await User.create({ email, password: hashed_pass, skills });

        // 3. Fire Inngest event
        await inngest.send({
            name: "user/signup",
            data: { email },
        });

        // 4. Create JWT token
        const token = jwt.sign({ _id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "7d" } // optional expires = 7 days
        );

        // 5. TODO: Sanitize user data and return JWT token
        res.status(201).json({ user, token });
    } catch(error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            error: "Signup failed",
            message: error.message,
        });
    }
};
/////////////////////////////////////////////////////
// Login
/////////////////////////////////////////////////////
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Get user from database
        const user = await User.findOne({ email });
        // 2. compare the bcrypted password
        if(!user) {
            console.error("login Error:", error);
            res.status(401).json({
                error: "User not found",
                message: error.message,
            })
        };
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) {
            console.error("login Error:", error);
            res.status(401).json({
                error: "Invalid credentials",
                message: error.message,
            })
        }
        // 3. create jwt token for signing-in
        const token = jwt.sign({ _id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "7d" } // optional expires = 7 days
        );

        // 4. TODO: Sanitize user data and return JWT token
        res.status(201).json({ user, token });

    } catch(error) {
        console.error("login Error:", error);
        res.status(500).json({
            error: "login failed",
            message: error.message,
        });
    }
};
/////////////////////////////////////////////////////
// Logout 
// functionality: using cookie access removal (more details can be seen in the diagrams)
/////////////////////////////////////////////////////
export const logout = async(req, res) => {
    try {
        const authHeader = req.headers.authorization;

        // check if the header is empty
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error("Unauthorized", error);
            res.status(401).json({
                error: "Unauthorized",
                message: error.message,
            });
        }
        const token = authHeader.split(" ")[1]
            // 1. remove the JWT token from the user's cookie
        jwt.verify(token, process.env.JWT_SECRET,
            //callback
            (err, decoded) => {
                if(err) {
                    console.error("Unauthorized", error);
                    res.status(401).json({
                        error: "Unauthorized",
                        message: error.message,
                    });
                }
                // Token can't be invalidated server-side without blacklist
                // But you can respond with instruction to remove it client-side
                res.status(200).json({
                    message: "Logged out successfully. Please remove token on client side.",
                    token: null, // optional: send null to client
                });
            })
    } catch(error) {
        console.error("Logout Error", error);
        res.status(500).json({
            error: "Logout Failed",
            message: error.message,
        });
    }
};

/////////////////////////////////////////////////////
// Update
/////////////////////////////////////////////////////
export const updateUser = async(req, res) => {
    const { skills = [], role, email } = req.body;
    try {
        // 1. find existing user to be updated
        if(user.role)
        // User must not be an admin
            if(user.role !== "admin") {
                console.error("Forbidden", error);
                res.status(403).json({
                    error: "Forbidden",
                    message: error.message,
                });
            }
        const user = await User.findOne({ email });
        if(!user) {
            console.error("You're no longer allowed to access", error);
            res.status(401).json({ // also 404
                error: "User not found",
                message: error.message,
            });
        }
        // If found, update the user
        await User.updateOne({ email }, { skills: skills.length ? skills : user.skills, role })
        return res.json({ message: "User udpated successfully" })

    } catch(error) {
        console.error("", error);
        res.status(500).json({ // also 404
            error: "Internal Server Error, User cannot be updated",
            message: error.message,
        });
    }
}

/////////////////////////////////////////////////////
// Update one/all
/////////////////////////////////////////////////////
export const getUser = async(req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                error: "Not Found",
                message: "User does not exist"
            });
        }
        return res.json(user);
    } catch(error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
};

export const getAllUsers = async(req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch(error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
};

/////////////////////////////////////////////////////
// Delete
/////////////////////////////////////////////////////
export const deleteUser = async(req, res) => {
    const { email } = req.body;
    try {
        const deleted = await User.findOneAndDelete({ email });
        if(!deleted) {
            return res.status(404).json({
                error: "User not found",
                message: "No user with the given email"
            });
        }
        return res.json({ message: "User deleted successfully" });
    } catch(error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
};