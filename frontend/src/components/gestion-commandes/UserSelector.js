import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/userApi';
import './UserSelector.css';

const UserSelector = ({ selectedUsers, setSelectedUsers }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserSelection = (userId) => {
    if (!userId) {
      console.error("userId is undefined or null!");
      return;
    }

    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <div className="user-selector">
      <div className="user-list">
        {users.map(user => (
          <div
            key={user.id_User}  // Utilise user.id_User comme clé unique
            className={`user-oval ${selectedUsers.includes(user.id_User) ? 'selected' : ''}`}
            onClick={() => toggleUserSelection(user.id_User)}  // Passe user.id_User ici
          >
            {user.username}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSelector;
