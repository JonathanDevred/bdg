import bcrypt from 'bcrypt';
import express from 'express';
import { pool } from '../server.js';
import jwt from 'jsonwebtoken';

const authRoutes = express.Router();

// Route pour la connexion
authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Récupérer l'utilisateur par son email depuis la base de données
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      // Utilisateur non trouvé
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }

    // Comparer le mot de passe fourni avec le mot de passe haché stocké en base de données
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Mot de passe incorrect
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }

    // Générer le token d'authentification avec une expiration d'une heure
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Authentification réussie, renvoyer le token
    res.json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default authRoutes;
