// frontend/src/components/gestion-commandes/CommandeGlobaleList.js
import React, { useEffect, useState } from 'react';
import { getAllCommandeGlobale } from '../../api/commandeGlobaleApi';

const CommandeGlobaleList = () => {
  const [commandeGlobales, setCommandeGlobales] = useState([]);

  useEffect(() => {
    const fetchCommandeGlobales = async () => {
      try {
        const response = await getAllCommandeGlobale();
        setCommandeGlobales(response.data);
      } catch (error) {
        console.error('Error fetching commandeGlobales:', error);
      }
    };

    fetchCommandeGlobales();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {commandeGlobales.map((commande) => (
          <div className="col-md-4" key={commande.idCommandeGlobale}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Commande Globale #{commande.idCommandeGlobale}</h5>
                <p className="card-text">Date de départ: {commande.dateDepart}</p>
                <p className="card-text">État: {commande.etat ? 'Actif' : 'Inactif'}</p>
                <p className="card-text">Vendeurs associés:</p>
                <ul>
                  {commande.users.map((user) => (
                    <li key={user.id_User}>{user.username}</li>
                  ))}
                </ul>
                <a href={`/gestion-commandes/${commande.idCommandeGlobale}`} className="btn btn-primary">Voir Détails</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandeGlobaleList;
