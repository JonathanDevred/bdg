// tags.js

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

// Route pour créer un nouveau tag
tagsRoutes.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    // Vérifier si le tag existe déjà dans la base de données
    const existingTag = await pool.query('SELECT * FROM tags WHERE name = $1', [name]);
    if (existingTag.rows.length > 0) {
      return res.status(409).json({ error: 'Ce tag existe déjà' });
    }

    // Insérer le nouveau tag dans la table "tags"
    const tagQuery = 'INSERT INTO tags (name) VALUES ($1) RETURNING *';
    const tagValues = [name];
    const tagResult = await pool.query(tagQuery, tagValues);

    const newTag = tagResult.rows[0];
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Erreur lors de la création du tag:', error);
    res.status(500).json({ error: 'Problème lors de la création du tag.' });
  }
});

export default tagsRoutes;
