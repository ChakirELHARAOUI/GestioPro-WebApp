
// backend/services/userService.js

const bcrypt = require('bcryptjs');
const db = require('../database/index');
const { User } = db;

async function createUser (req, res){
    try{

      const existingUser = await User.findOne({ username: userData.username });
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }
      
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword
    });

    await user.save();
    return { success: true, message: 'Utilisateur créé avec succès' };

    }catch (error) {
      return { success: false, message: error.message };
    }
}

async function getAllUsers(){
    try {
      const users = await User.findAll();
      return { success: true, data: users };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function getUserById(userID){
  try {
    const user = await User.findByPk(userID);
    if (!user) {
        return { success: false, message: 'Utilisateur non trouvé' };
    }
    return { success: true, data: user };
  } catch (error) {
      return { success: false, message: error.message };
  }
}

async function updateUser(userId, updateData){
  try {
    // Si le mot de passe est mis à jour, le hasher
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!updatedUser) {
        return { success: false, message: 'Utilisateur non trouvé' };
    }
    return { success: true, data: updatedUser, message: 'Utilisateur mis à jour avec succès' };
  } catch (error) {
      return { success: false, message: error.message };
  }
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user.destroy();
}



module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser  
}


exports.updateUser = async (userId, updateData) => {
    try {
        // Si le mot de passe est mis à jour, le hasher
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        if (!updatedUser) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }
        return { success: true, data: updatedUser, message: 'Utilisateur mis à jour avec succès' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

exports.deleteUser = async (userId) => {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return { success: false, message: 'Utilisateur non trouvé' };
        }
        return { success: true, message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};


