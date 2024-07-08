
// database/services/userService.js

const { User } = require('../database/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  async createUser(userData) {

    try{
      
      // On vérifie que l'Utilisateur n'existe  pas déjà dans la base de données
      const existingUser = await User.findOne({ 
        where: { username: userData.username }
      });
      if (existingUser) {
        throw new Error('Cet utilisateur existe déjà');
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

  async findUserByUsername(username) {
    return User.findOne({ where: { username } });
  }

  async findUserById(id) {
    return User.findByPk(id);
  }

  async getAllUsers() {
    return User.findAll({ attributes: { exclude: ['password'] } });
  }

  async updateUser(id, updateData) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return user.update(updateData);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user.destroy();
  }

  async authenticateUser(username, password) {
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return { user: { id: user.id, username: user.username, role: user.role }, token };
  }

  async changePassword(id, oldPassword, newPassword) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    return user.update({ password: hashedNewPassword });
  }
}

module.exports = new UserService();
