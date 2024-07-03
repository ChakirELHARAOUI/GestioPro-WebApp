const db = require('../database/index');

async function updateProductBDD(id_produitBDD, newPrixVenteUnite, newFournisseur) {
  const product = await db.ProductBDD.findByPk(id_produitBDD);

  if (product) {
    // Check if price has changed
    if (product.prixVenteUnite !== newPrixVenteUnite) {
      // Create history entry
      await db.ProductBDDHistory.create({
        prixVenteUnite: product.prixVenteUnite,
        id_produitBDD: product.id_produitBDD
      });

      // Update product price
      product.prixVenteUnite = newPrixVenteUnite;
    }

    // Update supplier if it has changed
    if (product.fournisseur !== newFournisseur) {
      product.fournisseur = newFournisseur;
    }

    await product.save();
  }
}

async function getProductPriceHistory(id_produitBDD) {
  const history = await db.ProductBDDHistory.findAll({
    where: { id_produitBDD },
    order: [['createdAt', 'ASC']]
  });

  return history.map(entry => ({
    date: entry.createdAt,
    prixVenteUnite: entry.prixVenteUnite
  }));
}

module.exports = {
  updateProductBDD,
  getProductPriceHistory
};
