// frontend/src/components/CommandeGlobaleList.js
import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const CommandeGlobaleList = () => {
  const [commandeGlobales, setCommandeGlobales] = useState([]);

  useEffect(() => {
    const fetchCommandeGlobales = async () => {
      try {
        const response = await axios.get('api/commande-globale/all');
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
          <div className="col-md-4" key={commande.id}>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Commande Globale #{commande.id}</h5>
                <p className="card-text">Date de départ: {commande.dateDepart}</p>
                <p className="card-text">Vendeurs associés:</p>
                <ul>
                  {commande.CommandeSecteurs.map((secteur) => (
                    <li key={secteur.User.id}>{secteur.User.username}</li>
                  ))}
                </ul>
                <a href={`/commandeGlobales/${commande.id}`} className="btn btn-primary">Voir Détails</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommandeGlobaleList;
