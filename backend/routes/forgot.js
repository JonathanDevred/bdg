import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const forgotRoutes = express.Router();

// Route pour la récupération du mot de passe
forgotRoutes.post('/forgot', async (req, res) => {
  const { email } = req.body;

  // Vérifiez si l'adresse e-mail est valide, effectuez les vérifications supplémentaires si nécessaire
  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'L\'adresse e-mail est invalide.' });
  }

  // Générez un token JWT avec une clé secrète et une expiration de 1 heure
  const token = jwt.sign({ email }, process.env.JWT_SECRET_PASSWORD_RESET, { expiresIn: '1h' });

  try {
    // Ici, vous pouvez stocker le token en toute sécurité dans votre base de données ou ailleurs
    // Pour cet exemple, nous n'allons pas stocker le token, mais vous devriez le faire dans une application réelle.

    // Envoyez le token à l'adresse e-mail de l'utilisateur (ici, nous imprimons simplement le token dans la console)
    console.log('Token de réinitialisation du mot de passe :', token);

    res.json({ message: 'Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.' });
  }
});

// Vérifiez si l'adresse e-mail est valide
const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default forgotRoutes;
