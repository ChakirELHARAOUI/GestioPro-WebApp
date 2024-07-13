// scripts/databaseMaintenance.js

const db = require('./index');

async function checkInconsistentData() {
  try {
    const inconsistentRecords = await db.ProductBDDHistory.findAll({
      where: {
        id_produitBDD: {
          [db.Sequelize.Op.notIn]: db.Sequelize.literal(`(SELECT "id_produitBDD" FROM "ProductBDDs")`)
        }
      }
    });

    console.log('Nombre d\'enregistrements incohérents:', inconsistentRecords.length);
    console.log(inconsistentRecords);
  } catch (error) {
    console.error('Erreur lors de la vérification des données incohérentes:', error);
  }
}

async function cleanInconsistentData() {
  try {
    const result = await db.ProductBDDHistory.destroy({
      where: {
        id_produitBDD: {
          [db.Sequelize.Op.notIn]: db.Sequelize.literal(`(SELECT "id_produitBDD" FROM "ProductBDDs")`)
        }
      }
    });

    console.log(`${result} enregistrements incohérents ont été supprimés.`);
  } catch (error) {
    console.error('Erreur lors du nettoyage des données incohérentes:', error);
  }
}

async function main() {
  await checkInconsistentData();
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('Voulez-vous nettoyer les données incohérentes ? (y/n) ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      await cleanInconsistentData();
    }
    readline.close();
    process.exit();
  });
}

main();