import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { pool } from '../server.js';
dotenv.config();

const recoverRoutes = express.Router();

recoverRoutes.post('/', async (req, res) => {
  const { password, passwordConfirm, token } = req.body;

  try {
    // Vérifiez si le token est valide et n'a pas expiré
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_PASSWORD_RESET);
    
    // Vérification de la correspondance des mots de passe
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUserQuery = `
      UPDATE users
      SET password = $1
      WHERE email = $2
    `;

    await pool.query(updateUserQuery, [hashedPassword, decodedToken.email]);

    res.json({ message: 'Votre mot de passe a été modifié avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe', error);
    res.status(400).json({ error: 'Le lien de réinitialisation est invalide ou a expiré.' });
  }
});

export default recoverRoutes;
