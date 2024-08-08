// frontend/src/components/gestion-commandes/CommandeGlobaleDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCommandeGlobale, getQuantiteProduitsForCommandeGlobale, updateCommandeGlobale } from '../../api/commandeGlobaleApi';
import { getAllUsers } from '../../api/userApi';

const CommandeGlobaleDetails = () => {
  const { id } = useParams();
  const [commandeGlobale, setCommandeGlobale] = useState(null);
  const [quantiteProduits, setQuantiteProduits] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [commandeResponse, quantiteResponse] = await Promise.all([
          getCommandeGlobale(id),
          getQuantiteProduitsForCommandeGlobale(id)
        ]);
        setCommandeGlobale(commandeResponse.data);
        if (Array.isArray(quantiteResponse.data)) {
          setQuantiteProduits(quantiteResponse.data);
        } else {
          console.error('quantiteProduits is not an array:', quantiteResponse.data);
        }
        const usersResponse = await getAllUsers();
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const data = {
        userIds: selectedUsers,
        dateDepart: commandeGlobale.dateDepart
      };
      await updateCommandeGlobale(id, data);
      alert('Commande globale mise à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande globale:', error);
    }
  };

  if (!commandeGlobale) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Commande Globale #{commandeGlobale.idCommandeGlobale}</h2>
      <p>Date de départ: {commandeGlobale.dateDepart}</p>
      <p>État: {commandeGlobale.etat ? 'Actif' : 'Inactif'}</p>
      
      <h3>Quantité de Produits par Vendeur</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Produit</th>
            {commandeGlobale.users.map(user => (
              <th key={user.id_User}>{user.username}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {quantiteProduits.map(produit => (
            <tr key={produit.nom}>
              <td>{produit.nom}</td>
              {commandeGlobale.users.map(user => (
                <td key={user.id_User}>{produit.vendeurs[user.username] || 0}</td>
              ))}
              <td>{produit.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Modifier les Vendeurs Associés</h3>
      <select
        multiple
        value={selectedUsers}
        onChange={(e) => setSelectedUsers([...e.target.selectedOptions].map(option => option.value))}
      >
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>
      <button onClick={handleUpdate} className="btn btn-success">Mettre à Jour</button>

      <h3>Vendeurs</h3>
      <ul>
        {commandeGlobale.users.map((user) => (
          <li key={user.id_User}>
            <a href={`/vendeurs/${user.id_User}`}>{user.username}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommandeGlobaleDetails;
