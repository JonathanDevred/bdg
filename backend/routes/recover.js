import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../server.js';

const recoverRoutes = express.Router();

// Route pour la réinitialisation du mot de passe
recoverRoutes.post('/:id/:token', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Convertir l'ID en entier
    const token = req.params.token; // Utiliser le token directement
    const { password } = req.body;

    // Vérifier si le token correspond à l'utilisateur dans la table password_reset
    const tokenResult = await pool.query('SELECT * FROM password_reset WHERE user_id = $1 AND token = $2', [id, token]);

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Token invalide' });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);

    // Supprimer le token de la table password_reset
    await pool.query('DELETE FROM password_reset WHERE user_id = $1', [id]);

    res.json({ message: 'Votre mot de passe a été modifié avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe', error);
    res.status(400).json({ error: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.' });
  }
});

export default recoverRoutes;
