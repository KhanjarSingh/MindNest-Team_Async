const { createUser, findUser, updateUser,findUserByEmail } = require('../services/auth.service');

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields (username, email, password) are required" });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const newUser = await createUser({ username, email, password });
    return res.status(201).json({ message: "User created successfully", user: newUser });
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

  try {
    const updated = await updateUser(id, { username, email });
    return res.status(200).json({ message: "User updated successfully", user: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};




module.exports = { signup, getUser, updateUserController };
