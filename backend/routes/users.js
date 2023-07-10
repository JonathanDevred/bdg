import express from 'express';
import { pool } from '../server.js'; 

const usersRoutes = express.Router();

// Route pour récupérer tous les utilisateurs
usersRoutes.get('/', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(results.rows);
    }
  });
});

// Route pour récupérer un utilisateur par son nom
usersRoutes.get('/:id', (req, res) => {
  const userId = req.params.id;
  pool.query('SELECT * FROM users WHERE id = $1', [userId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur par nom', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      } else {
        res.json(results.rows[0]);
      }
    }
  });
});

export default usersRoutes;
