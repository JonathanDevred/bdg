import express from 'express';
import { pool } from '../server.js';

const commentsRoutes = express.Router();

commentsRoutes.use(express.json());
commentsRoutes.use(express.urlencoded({ extended: true }));

// FONCTION CREATE
commentsRoutes.post('/:articleId', (req, res) => {
  const articleId = req.params.articleId;
  const { title, content } = req.body;
  pool.query(
    'INSERT INTO commentaries (title, content, article_id) VALUES ($1, $2, $3) RETURNING *',
    [title, content, articleId],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la création du commentaire', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(results.rows[0]);
      }
    }
  );
});

// FONCTION READ

// Route pour récupérer tous les commentaires
commentsRoutes.get('/', (req, res) => {
  pool.query('SELECT * FROM commentaries', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des commentaires', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(results.rows);
    }
  });
});

// Route pour récupérer un commentaire par son ID
commentsRoutes.get('/:id', (req, res) => {
  const commentaryId = req.params.id;
  pool.query('SELECT * FROM commentaries WHERE id = $1', [commentaryId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération du commentaire', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({ error: 'Commentaire non trouvé' });
      } else {
        res.json(results.rows[0]);
      }
    }
  });
});

// Route pour récupérer les commentaires d'un article spécifique
commentsRoutes.get('/article/:articleId', (req, res) => {
  const articleId = req.params.articleId;
  pool.query('SELECT * FROM commentaries WHERE article_id = $1', [articleId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des commentaires', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(results.rows);
    }
  });
});

// FONCTION UPDATE
commentsRoutes.patch('/:articleId/:commentaryId', (req, res) => {
  const articleId = req.params.articleId;
  const commentaryId = req.params.commentaryId;
  const { title, content } = req.body;
  pool.query(
    'UPDATE commentaries SET title = $1, content = $2 WHERE article_id = $3 AND id = $4 RETURNING *',
    [title, content, articleId, commentaryId],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la mise à jour du commentaire', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (results.rows.length === 0) {
          res.status(404).json({ error: 'Commentaire non trouvé' });
        } else {
          res.json(results.rows[0]);
        }
      }
    }
  );
});

// FONCTION DELETE
commentsRoutes.delete('/:articleId/:commentaryId', (req, res) => {
  const articleId = req.params.articleId;
  const commentaryId = req.params.commentaryId;
  pool.query(
    'DELETE FROM commentaries WHERE article_id = $1 AND id = $2 RETURNING *',
    [articleId, commentaryId],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la suppression du commentaire', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (results.rows.length === 0) {
          res.status(404).json({ error: 'Commentaire non trouvé' });
        } else {
          res.json(results.rows[0]);
        }
      }
    }
  );
});

export default commentsRoutes;
