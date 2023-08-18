import express from 'express';
import { pool } from '../server.js'; 

const tagsRoutes = express.Router();


// FONCTION CREATE 


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

// FONCTION READ

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


// Route pour récupérer les tags associés à un article par son ID

tagsRoutes.get('/article/:articleId', (req, res) => {
  const articleId = req.params.articleId;
  pool.query(
    'SELECT tags.* FROM tags INNER JOIN articles_tags ON tags.id = articles_tags.tag_id WHERE articles_tags.article_id = $1',
    [articleId],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération des tags associés à l\'article', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(results.rows);
      }
    }
  );
});


// FONCTION UPDATE

tagsRoutes.patch('/article/:articleId', (req, res) => {
  const articleId = req.params.articleId;
  const newTagIds = req.body.tags; // Les nouveaux IDs des tags sélectionnés depuis le frontend

  pool.query(
    'DELETE FROM articles_tags WHERE article_id = $1',
    [articleId],
    (error) => {
      if (error) {
        console.error('Erreur lors de la suppression des anciennes associations de tags pour l\'article', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour des tags.' });
      } else {
        if (newTagIds.length > 0) {
          const values = newTagIds.map(tagId => `(${articleId}, ${tagId})`).join(', ');
          const insertQuery = `INSERT INTO articles_tags (article_id, tag_id) VALUES ${values}`;

          pool.query(
            insertQuery,
            (error) => {
              if (error) {
                console.error('Erreur lors de l\'insertion des nouvelles associations de tags pour l\'article', error);
                res.status(500).json({ error: 'Erreur serveur lors de la mise à jour des tags.' });
              } else {
                const updatedTagsResponse = {
                  success: true,
                  message: 'Tags associés à l\'article mis à jour avec succès.',
                };
                res.json(updatedTagsResponse);
              }
            }
          );
        } else {
          const updatedTagsResponse = {
            success: true,
            message: 'Tags associés à l\'article mis à jour avec succès.',
          };
          res.json(updatedTagsResponse);
        }
      }
    }
  );
});



export default tagsRoutes;
