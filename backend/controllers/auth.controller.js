const { createUser, findUser, updateUser, findUserByEmail, comparePass } = require('../services/auth.service');
const { generateJWT } = require('./jwt.controller');

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields (username, email, password) are required" });
    }

    try {
        const existingUser = await findUserByEmail(email, "email");
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const newUser = await createUser({ username, email, password });
        const token = await generateJWT({ id: newUser.id, email: newUser.email });

        return res.status(201).json({ message: "User created successfully", user: newUser, token });
    } catch (err) {
        console.error("Signup error:", err.message);
        return res.status(500).json({ message: err.message || "Failed to create user" });
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

        const token = await generateJWT({ id: findingUser.id, email: findingUser.email });
        return res.status(200).json({
            message: "User successfully logged in",
            user: findingUser,
            token
        });
    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({ message: err.message || "Failed to create user" });
    }
};




module.exports = { signup, getUser, updateUserController, login };
