
async function getStockSecteurByUserId(db, userId) {
    try {
        const user = await db.User.findOne({
        where: { id_User: userId },
        include: {
            model: db.StockSecteur,
            attributes: ['idStockSecteur']
        }
        });

        if (user && user.StockSecteur) {
        return user.StockSecteur.idStockSecteur;
        } else {
        throw new Error(`No StockSecteur found for user ${userId}`);
        }
    } catch (error) {
        console.error(`Error fetching StockSecteur for user ${userId}:`, error);
        throw error;
    }
}

module.exports = {
  getStockSecteurByUserId,
};
