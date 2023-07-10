import express from 'express';
import { pool } from '../server.js'; 

const tagsRoutes = express.Router();

// Route pour récupérer tous les tags
tagsRoutes.get('/', (req, res) => {
  pool.query('SELECT * FROM tags', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des tags', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(results.rows);
    }
  });
});

// Route pour récupérer les tags par nom
tagsRoutes.get('/:name', (req, res) => {
  const tagName = req.params.name;
  pool.query('SELECT * FROM tags WHERE name = $1', [tagName], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des tags par nom', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({ error: 'Tag non trouvé' });
      } else {
        res.json(results.rows[0]);
      }
    }
  });
});

export default tagsRoutes;
