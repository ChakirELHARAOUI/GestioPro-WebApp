// src/utils.js
export const getRoleString = (roleNumber) => {
    switch(roleNumber) {
      case 0:
        return 'vendeur';
      case 1:
        return 'manager';
      case 2:
        return 'admin';
      default:
        return 'unknown';
    }
  };
  