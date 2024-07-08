const bcrypt = require('bcrypt');

// Le mot de passe que vous voulez hasher
const password = "test";

// Nombre de rounds de salage (10 est généralement un bon choix)
const saltRounds = 10;

// Générer le hash
bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error("Erreur lors du hashage :", err);
    } else {
        console.log("Mot de passe original :", password);
        console.log("Hash bcrypt :", hash);
    }
});