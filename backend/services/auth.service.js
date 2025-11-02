const prisma = require('../prisma/client');
const bcrypt = require('bcrypt');


const createUser = async ({ username, email, password }) => {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role_id: 1,
      },
    });

    return newUser;
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error("Failed to create user");
  }
};



const findUser = async (id) => {
  try {
    if (id) {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      return user;
    } else {
      const users = await prisma.user.findMany();
      return users;
    }
  } catch (err) {
    console.error("Error finding user:", err);
    throw new Error("Failed to find users");
  }
};



const updateUser = async (id, data) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });

    return updatedUser;
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error("Could not update user");
  }
};


const findUserByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};


module.exports = { createUser, findUser, updateUser,findUserByEmail };