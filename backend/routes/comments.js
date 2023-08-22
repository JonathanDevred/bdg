import express from 'express';
import { pool } from '../server.js';

const commentsRoutes = express.Router();

commentsRoutes.use(express.json());
commentsRoutes.use(express.urlencoded({ extended: true }));

// FONCTION CREATE
commentsRoutes.post('/article/:articleId', (req, res) => {
  const articleId = req.params.articleId;
  const { user_id, content } = req.body;
  pool.query(
    'INSERT INTO post_comments (article_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
    [articleId, user_id, content],
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
  pool.query(
    `SELECT pc.*, u.username as user_pseudo
    FROM post_comments AS pc
    LEFT JOIN users AS u ON pc.user_id = u.id`,
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération des commentaires', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(results.rows);
      }
    }
  );
});


// Route pour récupérer un commentaire par son ID avec le pseudonyme de l'utilisateur
commentsRoutes.get('/:id', (req, res) => {
  const commentaryId = req.params.id;
  pool.query(
    `SELECT c.*, u.username AS user_pseudo
    FROM post_comments AS c
    LEFT JOIN users AS u ON c.user_id = u.id
    WHERE c.id = $1`,
    [commentaryId],
    (error, results) => {
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
    }
  );
});


// Route pour récupérer les commentaires d'un article spécifique
commentsRoutes.get('/article/:articleId', async (req, res) => {
  const articleId = req.params.articleId;
  try {
    const commentsResult = await pool.query(
      'SELECT pc.id, pc.content, pc.user_id, u.username, pc.created_at FROM post_comments AS pc LEFT JOIN users AS u ON pc.user_id = u.id WHERE article_id = $1',
      [articleId]
    );
    res.json(commentsResult.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// FONCTION UPDATE
commentsRoutes.patch('/:id', (req, res) => {
  const commentaryId = req.params.id;
  const { content } = req.body;
  pool.query(
    'UPDATE post_comments SET content = $1 WHERE id = $2 RETURNING *',
    [content, commentaryId],
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
commentsRoutes.delete('/:id', (req, res) => {
  const commentaryId = req.params.id;
  pool.query(
    'DELETE FROM post_comments WHERE id = $1 RETURNING *',
    [commentaryId],
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
