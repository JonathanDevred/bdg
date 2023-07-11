import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../server.js';

const usersRoutes = express.Router();

// Route pour créer un utilisateur
usersRoutes.post('/', (req, res) => {
  const { email, username, password } = req.body;

  // Vérification si l'utilisateur existe déjà
  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur existant', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (results.rows.length > 0) {
        res.status(409).json({ error: 'Cet utilisateur existe déjà', message: 'Si vous avez oublié votre mot de passe, veuillez utiliser la fonctionnalité de réinitialisation du mot de passe.' });
      } else {
        // Hachage du mot de passe
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (hashError, hash) => {
          if (hashError) {
            console.error('Erreur lors du hachage du mot de passe', hashError);
            res.status(500).json({ error: 'Erreur serveur' });
          } else {
            // Création de l'utilisateur dans la base de données
            pool.query(
              'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *',
              [email, username, hash],
              (insertError, insertResults) => {
                if (insertError) {
                  console.error('Erreur lors de la création de l\'utilisateur', insertError);
                  res.status(500).json({ error: 'Erreur serveur' });
                } else {
                  res.json(insertResults.rows[0]);
                }
              }
            );
          }
        });
      }
    }
  });
});

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
