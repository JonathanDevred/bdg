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
      res.status(401).json({ error: 'Email incorrect' });
      return;
    }

    // Comparer le mot de passe fourni avec le mot de passe haché stocké en base de données
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Mot de passe incorrect
      res.status(401).json({ error: 'Mot de passe incorrect' });
      return;
    }

    // Générer le token d'authentification avec une expiration de 2 heures
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Authentification réussie, renvoyer le token
    res.json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour la récupération du mot de passe
authRoutes.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifier si l'utilisateur existe dans la base de données
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    // Générer le jeton de réinitialisation de mot de passe

    // Enregistrer le jeton dans la base de données ou système de stockage temporaire
    // ...

    // Envoyer un e-mail à l'utilisateur avec le lien de réinitialisation contenant le jeton
    // ...

    res.json({ message: 'Un e-mail de réinitialisation de mot de passe a été envoyé' });
  } catch (error) {
    console.error('Erreur lors de la récupération du mot de passe', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer les informations de l'utilisateur connecté
authRoutes.get('/user', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: 'Token manquant' });
    return;
  }

  try {
    // Vérifier et décoder le token d'authentification
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Récupérer les informations de l'utilisateur depuis la base de données
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    // Renvoyer les informations de l'utilisateur connecté
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur connecté', error);
    res.status(401).json({ error: 'Token invalide' });
  }
});

export default authRoutes;
