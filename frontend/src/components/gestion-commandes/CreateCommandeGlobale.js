import React, { useState } from 'react';
import { createCommandeGlobale } from '../../api/commandeGlobaleApi';
import UserSelector from './UserSelector';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const CreateCommandeGlobale = ({ onCommandeCreated }) => {
  const [dateDepart, setDateDepart] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleCreateCommande = async () => {
    try {
      const data = {
        dateDepart: dateDepart ? dateDepart.toLocaleDateString('fr-FR') : '',
        userIds: selectedUsers,
      };
      await createCommandeGlobale(data);
      onCommandeCreated();
      setIsFormVisible(false);
    } catch (error) {
      console.error('Erreur lors de la création de la commande globale:', error);
    }
  };

  return (
    <div>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <FontAwesomeIcon icon={isFormVisible ? faTimes : faPlus} /> {isFormVisible ? 'Annuler' : 'Créer'}
      </button>
      {isFormVisible && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Nouvelle Commande Globale</h5>
            <div className="form-group">
              <label>Date de départ:</label>
              <DatePicker
                selected={dateDepart}
                onChange={(date) => setDateDepart(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                placeholderText="JJ/MM/AAAA"
              />
            </div>
            <div className="form-group">
              <label>Associer des utilisateurs:</label>
              <UserSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
            </div>
            <button onClick={handleCreateCommande} className="btn btn-success">Créer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCommandeGlobale;
