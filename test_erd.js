// Importation de l'objet sequelize et des modèles configurés depuis index.js
const { writeFileSync } = require('fs');
const sequelizeErd = require('sequelize-erd');

// Importez votre instance Sequelize et modèles à partir de index.js
const { sequelize } = require('./backend/database/index'); // Chemin vers votre fichier index.js

(async function() {
  try {
    // Génère le diagramme ERD en format SVG
    const svg = await sequelizeErd({ source: sequelize });
    
    // Écrit le fichier SVG sur le disque
    writeFileSync('./erd.svg', svg);

    console.log('ERD generated successfully: erd.svg');
  } catch (error) {
    console.error('Error generating ERD:', error);
  }
})();
