import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCommandeGlobale, getQuantiteProduitsForCommandeGlobale, updateCommandeGlobale } from '../../api/commandeGlobaleApi';
import { getAllUsers } from '../../api/userApi';
import UserSelector from './UserSelector';
import './CommandeGlobaleDetails.css';

// Fonction utilitaire pour formater la date en JJ/MM/AAAA
const formatDateToDisplay = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// Fonction utilitaire pour formater la date en AAAA-MM-JJ (format input)
const formatDateForInput = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

const CommandeGlobaleDetails = () => {
  const { id } = useParams();
  const [commandeGlobale, setCommandeGlobale] = useState(null);
  const [quantiteProduits, setQuantiteProduits] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);

  // Fonction pour charger les données de commande globale
  const fetchCommandeGlobale = async () => {
    try {
      const commandeResponse = await getCommandeGlobale(id);
      setCommandeGlobale(commandeResponse.data);
      setSelectedUsers(commandeResponse.data.users.map(user => user.id_User));
    } catch (error) {
      console.error('Error fetching commande globale:', error);
    }
  };

  // Fonction pour charger les quantités de produits
  const fetchQuantiteProduits = async () => {
    try {
      const quantiteResponse = await getQuantiteProduitsForCommandeGlobale(id);
      setQuantiteProduits(quantiteResponse.data);
    } catch (error) {
      console.error('Error fetching quantite produits:', error);
    }
  };

  // Fonction pour charger les utilisateurs
  const fetchUsers = async () => {
    try {
      const usersResponse = await getAllUsers();
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchCommandeGlobale();
    fetchQuantiteProduits();
    fetchUsers();
  }, [id]);

  const handleUpdate = async () => {
    try {
      // Préparation des données à envoyer
      const data = {
        userIds: selectedUsers,
        dateDepart: commandeGlobale.dateDepart,
        etat: commandeGlobale.etat,
        quantiteProduits: selectedUsers.reduce((acc, userId) => {
          acc[userId] = quantiteProduits.map(produit => ({
            id_catalogueProduit: produit.id_catalogueProduit,
            quantite: produit.vendeurs[users.find(user => user.id_User === userId).username] || 0
          }));
          return acc;
        }, {})
      };
  
      // Envoi de la requête au serveur
      await updateCommandeGlobale(id, data);
      alert('Commande globale mise à jour avec succès!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande globale:', error);
    }
  };
  

  const handleQuantiteChange = (produitIndex, userId, newQuantite) => {
    const newQuantiteProduits = [...quantiteProduits];
    newQuantiteProduits[produitIndex].vendeurs[users.find(user => user.id_User === userId).username] = parseInt(newQuantite) || 0;
    newQuantiteProduits[produitIndex].total = Object.values(newQuantiteProduits[produitIndex].vendeurs).reduce((sum, q) => sum + q, 0);
    setQuantiteProduits(newQuantiteProduits);
  };

  const handleCancelEdit = () => {
    // Recharger uniquement les quantités de produits
    fetchQuantiteProduits();
    setIsEditing(false);
  };

  if (!commandeGlobale) {
    return <div className="commande-details__loading">Loading...</div>;
  }

  return (
    <div className="commande-details__container">
      <h2 className="commande-details__title">Commande Globale #{commandeGlobale.idCommandeGlobale}</h2>
      <div className="commande-details__card">
        <div className="commande-details__card-body">
          <div className="commande-details__row">
            <div className="commande-details__col commande-details__col--left">
              {isEditing ? (
                <input
                  type="date"
                  className="commande-details__input"
                  value={formatDateForInput(commandeGlobale.dateDepart)}
                  onChange={(e) => setCommandeGlobale({ ...commandeGlobale, dateDepart: formatDateToDisplay(e.target.value) })}
                />
              ) : (
                <p className="commande-details__date">{commandeGlobale.dateDepart}</p>
              )}
            </div>
            <div className="commande-details__col commande-details__col--right">
              {isEditing ? (
                <select
                  className="commande-details__select"
                  value={commandeGlobale.etat ? 'Actif' : 'Inactif'}
                  onChange={(e) => setCommandeGlobale({ ...commandeGlobale, etat: e.target.value === 'Actif' })}
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              ) : (
                <p className={`commande-details__etat ${commandeGlobale.etat ? 'commande-details__etat--actif' : 'commande-details__etat--inactif'}`}>
                  {commandeGlobale.etat ? 'Actif' : 'Inactif'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <h3 className="commande-details__section-title">Utilisateurs Associés à cette Commande Globale</h3>
      <div className="commande-details__card">
        <div className="commande-details__card-body commande-details__card-body--centered">
          {isEditing ? (
            <UserSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} users={users} />
          ) : (
            <div className="commande-details__user-badges">
              {commandeGlobale.users.map((user) => (
                <span key={user.id_User} className={`commande-details__badge ${user.role === 1 ? 'commande-details__badge--manager' : 'commande-details__badge--vendeur'}`}>
                  {user.username}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <h3 className="commande-details__section-title">Quantité de Produits par Utilisateurs</h3>
      <div className="commande-details__table-responsive">
        <table className="commande-details__table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Total</th>
              {commandeGlobale.users.map(user => (
                <th key={user.id_User}>{user.username}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quantiteProduits.map((produit, produitIndex) => (
              <tr key={produit.nom}>
                <td>{produit.nom}</td>
                <td className="commande-details__total">{produit.total}</td>
                {commandeGlobale.users.map(user => (
                  <td key={user.id_User}>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        className="commande-details__input-quantity"
                        value={produit.vendeurs[user.username] || 0}
                        onChange={(e) => handleQuantiteChange(produitIndex, user.id_User, e.target.value)}
                      />
                    ) : (
                      produit.vendeurs[user.username] || 0
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="commande-details__actions">
        {isEditing ? (
          <>
            <button onClick={handleUpdate} className="commande-details__btn commande-details__btn--primary">
              Enregistrer
            </button>
            <button onClick={handleCancelEdit} className="commande-details__btn commande-details__btn--secondary">
              Annuler
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="commande-details__btn commande-details__btn--secondary">
            Modifier
          </button>
        )}
      </div>
    </div>
  );
};

export default CommandeGlobaleDetails;
