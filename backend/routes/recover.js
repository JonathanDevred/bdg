import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Route pour la récupération du mot de passe
router.post('/', (req, res) => {
  const { password, passwordConfirm, token } = req.body;

  // Vérifiez si le token est valide et n'a pas expiré
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_PASSWORD_RESET);
    
    // Si le token est valide, vous pouvez procéder à la réinitialisation du mot de passe
    // Ajoutez votre logique de réinitialisation de mot de passe ici

    res.json({ message: 'Votre mot de passe a été modifié avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la vérification du token', error);
    res.status(400).json({ error: 'Le lien de réinitialisation est invalide ou a expiré.' });
  }
});

export default router;
