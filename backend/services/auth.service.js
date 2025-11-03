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
    const userId = Number(id);
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (data.email) {
      const emailUsed = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (emailUsed && emailUsed.id !== userId) {
        throw new Error("Email already in use by another user");
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return updatedUser;
  } catch (err) {
    console.error("Error updating user:", err);
    throw new Error(err.message || "Could not update user");
  }
};




const findUserByEmail = async (checkingVar,checkingVariableType) => {
    if (checkingVariableType=="email"){
        return await prisma.user.findUnique({ where: { email:checkingVar } });
    }
    else if (checkingVariableType == "username"){
        return await prisma.user.findUnique({ where: { username:checkingVar } });
    }
};

const comparePass = async (userPass, actualPass) => {
  try {
    return await bcrypt.compare(userPass, actualPass);
  } catch (err) {
    console.error("Password comparison error:", err);
    return false;
  }
};

module.exports = { createUser, findUser, updateUser,findUserByEmail,comparePass };