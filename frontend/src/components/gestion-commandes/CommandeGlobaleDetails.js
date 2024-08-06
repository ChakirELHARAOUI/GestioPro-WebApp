// frontend/src/components/CommandeGlobaleDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

const CommandeGlobaleDetails = () => {
  const { id } = useParams();
  const [commandeGlobale, setCommandeGlobale] = useState(null);

  useEffect(() => {
    const fetchCommandeGlobale = async () => {
      try {
        const response = await axios.get(`/commande-globale/2/${id}`);
        setCommandeGlobale(response.data);
      } catch (error) {
        console.error('Error fetching commandeGlobale:', error);
      }
    };

    fetchCommandeGlobale();
  }, [id]);

  if (!commandeGlobale) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Commande Globale #{commandeGlobale.id}</h2>
      <p>Date de départ: {commandeGlobale.dateDepart}</p>
      <h3>Quantité de Produits</h3>
      <ul>
        {commandeGlobale.CommandeSecteurs.flatMap((secteur) =>
          secteur.QuantiteProduits.map((quantiteProduit) => (
            <li key={quantiteProduit.id}>
              {quantiteProduit.CatalogueProduit.nom} - {quantiteProduit.quantite}
            </li>
          ))
        )}
      </ul>
      <h3>Vendeurs</h3>
      <ul>
        {commandeGlobale.CommandeSecteurs.map((secteur) => (
          <li key={secteur.User.id}>
            <a href={`/vendeurs/${secteur.User.id}`}>{secteur.User.username}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommandeGlobaleDetails;
