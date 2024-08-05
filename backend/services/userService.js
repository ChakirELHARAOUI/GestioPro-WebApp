
// database/services/userService.js

const { User, StockSecteur, sequelize} = require('../database/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DEFAULT_USER_ID = 1;
const DEFAULT_USERNAME = 'admin';


async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function isUsernameUnique(username, transaction) {
  const existingUser = await User.findOne({
    where: { username },
    transaction
  });
  return !existingUser;
}



async function createUserInDB(userData, transaction) {
  const { username, password, sector, role } = userData;
  // Vérifier si le nom d'utilisateur est unique
  const isUnique = await isUsernameUnique(username, transaction);
  if (!isUnique) {
    throw new Error('Ce nom d\'utilisateur est déjà utilisé');
  }

  return await User.create({
    username,
    password,
    sector,
    role
  }, { transaction });
}

async function createStockSecteurForUser(user, transaction) {
  return await StockSecteur.create({
    id_User: user.id_User,
    sector: user.sector,
    nombreCagette: 0,
    credit: 0
  }, { transaction });
}


class UserService {
  async createUser(userData) {
      const transaction = await sequelize.transaction();
      try {
        const user = await createUserInDB(userData, transaction);
        await createStockSecteurForUser(user, transaction);

        await transaction.commit();
        return { success: true, message: 'Utilisateur et StockSecteur créés avec succès', user };
      } catch (error) {
        await transaction.rollback();
        console.error('Error in createUser:', error);
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

    const existingUser = await User.findOne({ 
      where: { username: updateData.username }
    });
    if (existingUser && existingUser.username !== user.username) {
      throw new Error("Cet username est déjà utilisé par un autre utilisateur");
    }
    return user.update(updateData);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (user.id_User === DEFAULT_USER_ID && user.username === DEFAULT_USERNAME) {
      throw new Error("L'utilisateur par défaut ne peut pas être supprimé.");
    }
    if (!user) {
      throw new Error('User not found');
    }
    return user.destroy();
  }

  async createDefaultUserIfNoneExist (){
    try {
      const userCount = await User.count();
  
      if (userCount === 0) {
        const username = 'admin';
        const password = 'secretpassword'; // Change-le pour un mot de passe sécurisé
        const sector = 'default';
        const role = 1; // Par exemple, 1 pour admin
  
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          username,
          password: hashedPassword,
          sector,
          role
        });
  
        console.log('Un utilisateur par défaut a été créé.');
        return newUser;
      } else {
        console.log('Il y a déjà des utilisateurs dans la base de données.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification ou de la création de l\'utilisateur par défaut:', error);
      throw error;
    }
  };

  //PAS ENCORE UTILISER
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
