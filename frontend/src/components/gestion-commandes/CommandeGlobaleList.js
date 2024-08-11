// src/components/gestion-commandes/CommandeGlobaleList.js

import React, { useEffect, useState } from 'react';
import { getAllCommandeGlobale, deleteCommandeGlobale } from '../../api/commandeGlobaleApi';
import CreateCommandeGlobale from './CreateCommandeGlobale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import './CommandeGlobaleList.css';

const CommandeGlobaleList = () => {
  const [commandeGlobales, setCommandeGlobales] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchCommandeGlobales = async () => {
    try {
      const response = await getAllCommandeGlobale();
      setCommandeGlobales(response.data);
    } catch (error) {
      console.error('Error fetching commandeGlobales:', error);
    }
  };

  useEffect(() => {
    fetchCommandeGlobales();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande globale ?')) {
      try {
        await deleteCommandeGlobale(id);
        alert('Commande globale supprimée avec succès!');
        fetchCommandeGlobales();
      } catch (error) {
        console.error('Erreur lors de la suppression de la commande globale:', error);
      }
    }
  };

  return (
    <div className="container">
      <button className="btn btn-primary mb-3" onClick={() => setShowCreateForm(!showCreateForm)}>
        <FontAwesomeIcon icon={faPlus} /> Créer une Commande Globale
      </button>
      {showCreateForm && (
        <div className="mb-4">
          <CreateCommandeGlobale onCommandeCreated={fetchCommandeGlobales} />
        </div>
      )}
      <div className="commande-card-container">
        {commandeGlobales.map((commande) => (
          <div className="commande-card mb-4" key={commande.idCommandeGlobale}>
            <div className="commande-card-body">
              <h5 className="card-title">Commande Globale #{commande.idCommandeGlobale}</h5>
              <p className="card-text">Date de départ: <span className="date">{commande.dateDepart}</span></p>
              <p className="card-text">État: <span className={`etat ${commande.etat ? 'actif' : 'inactif'}`}>{commande.etat ? 'Actif' : 'Inactif'}</span></p>
              <p className="card-text">Vendeurs associés:</p>
              <div className="vendeurs">
                {commande.users.map((user) => (
                  <span key={user.id_User} className={`vendeur-badge ${user.role === 1 ? 'role-manager' : 'role-vendeur'}`}>
                    {user.username}
                  </span>
                ))}
              </div>
              <div className="d-flex justify-content-center mt-3">
                <a href={`/gestion-commandes/${commande.idCommandeGlobale}`} className="btn btn-outline-primary mx-2">
                  <FontAwesomeIcon icon={faEye} /> Détails
                </a>
                <button onClick={() => handleDelete(commande.idCommandeGlobale)} className="btn btn-outline-danger mx-2">
                  <FontAwesomeIcon icon={faTrash} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandeGlobaleList;
