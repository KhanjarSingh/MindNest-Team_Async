const { createUser, findUser, updateUser, findUserByEmail, comparePass } = require('../services/auth.service');
const { generateJWT } = require('./jwt.controller');

const signup = async (req, res, next) => {
    const { username, email, password, role = 'PARTICIPANT', adminSecret } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields (username, email, password) are required" });
    }

    // Validate role
    if (role && !['PARTICIPANT', 'ADMIN'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be PARTICIPANT or ADMIN" });
    }

    // Validate admin secret if role is ADMIN
    if (role === 'ADMIN' && !adminSecret) {
        return res.status(400).json({ message: "Admin secret is required for admin registration" });
    }

    try {
        const existingUser = await findUserByEmail(email, "email");
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const newUser = await createUser({ username, email, password, role, adminSecret });
        const token = await generateJWT({ id: newUser.id, email: newUser.email, role: newUser.role });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User created successfully",
            user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
            token
        });
    } catch (err) {
        console.error("Signup error:", err.message);

        // Handle specific known errors
        if (err.message === 'Username already exists' || err.message === 'Invalid admin secret') {
            return res.status(400).json({ message: err.message });
        }

        // Handle Prisma unique constraint errors if they leak through
        if (err.message.includes('Unique constraint failed')) {
            if (err.message.includes('email')) {
                return res.status(400).json({ message: "User already exists with this email" });
            }
            if (err.message.includes('username')) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        // Generic error for everything else
        return res.status(500).json({ message: "Failed to create user. Please try again later." });
    }
};


const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await findUser(id);
        if (!user || (Array.isArray(user) && user.length === 0)) {
            return res.status(404).json({ message: "No user found" });
        }
        return res.status(200).json({ message: "Success", data: user });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const updateUserController = async (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!username && !email)
        return res.status(400).json({ message: "At least one field (username or email) must be provided" });

    try {
        const updatedUser = await updateUser(id, { username, email });
        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        if (err.message === "User not found")
            return res.status(404).json({ message: "User not found" });
        if (err.message.includes("Email already in use"))
            return res.status(400).json({ message: err.message });
        return res.status(500).json({ message: "Failed to update user" });
    }
};


const login = async (req, res, next) => {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
        return res.status(400).json({ message: "All fields (username/email and password) are required" });
    }

    try {
        const identifier = username ? "username" : "email";
        const value = username || email;

        const findingUser = await findUserByEmail(value, identifier);
        if (!findingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await comparePass(password, findingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = await generateJWT({ id: findingUser.id, email: findingUser.email, role: findingUser.role });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "User successfully logged in",
            user: { id: findingUser.id, username: findingUser.username, email: findingUser.email, role: findingUser.role },
            token
        });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ message: err.message || "Failed to login" });
    }
};


const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { signup, getUser, updateUserController, login, logout };
