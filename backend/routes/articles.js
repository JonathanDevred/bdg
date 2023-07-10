import express from 'express';
import { pool } from '../server.js';

const articlesRoutes = express.Router();

articlesRoutes.use(express.json());
articlesRoutes.use(express.urlencoded({ extended: true }));

// FONCTION CREATE

articlesRoutes.post('/', (req, res) => {
  const { title, content } = req.body;
  pool.query(
    'INSERT INTO articles (title, content, pictures) VALUES ($1, $2, $3) RETURNING *',
    [title, content],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la création de l\'article', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(results.rows[0]);
      }
    }
  );
});

// FONCTION READ

// Route pour récupérer tous les articles avec les tags
articlesRoutes.get('/', (req, res) => {
  pool.query(
    `SELECT a.*, array_agg(t.name) as tags
    FROM articles AS a
    LEFT JOIN article_tags AS at ON a.id = at.article_id
    LEFT JOIN tags AS t ON at.tag_id = t.id
    GROUP BY a.id`,
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération des articles', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(results.rows);
      }
    }
  );
});

// Route pour récupérer un article par son titre avec les tags
articlesRoutes.get('/:title', (req, res) => {
  const articleTitle = req.params.title;
  pool.query(
    `SELECT a.*, array_agg(t.name) as tags
    FROM articles AS a
    LEFT JOIN article_tags AS at ON a.id = at.article_id
    LEFT JOIN tags AS t ON at.tag_id = t.id
    WHERE a.title = $1
    GROUP BY a.id`,
    [articleTitle],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération de l\'article', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (results.rows.length === 0) {
          res.status(404).json({ error: 'Article non trouvé' });
        } else {
          res.json(results.rows[0]);
        }
      }
    }
  );
});

// Route pour récupérer les articles par tag avec les tags
articlesRoutes.get('/tag/:tag', (req, res) => {
  const tagName = req.params.tag;
  pool.query(
    `SELECT a.*, array_agg(t.name) as tags
    FROM articles AS a
    LEFT JOIN article_tags AS at ON a.id = at.article_id
    LEFT JOIN tags AS t ON at.tag_id = t.id
    WHERE t.name = $1
    GROUP BY a.id`,
    [tagName],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération des articles par tag', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        res.json(results.rows);
      }
    }
  );
});

// FONCTION UPDATE

articlesRoutes.patch('/:id', (req, res) => {
  const articleId = req.params.id;
  const { title, content, user_id, pictures } = req.body;
  pool.query(
    'UPDATE articles SET title = $1, content = $2, user_id = $3, pictures = $4 WHERE id = $5 RETURNING *',
    [title, content, user_id, pictures, articleId],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la mise à jour de l\'article', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (results.rows.length === 0) {
          res.status(404).json({ error: 'Article non trouvé' });
        } else {
          res.json(results.rows[0]);
        }
      }
    }
  );
});

// FONCTION DELETE

articlesRoutes.delete('/:id', (req, res) => {
  const articleId = req.params.id;
  pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [articleId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la suppression de l\'article', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({ error: 'Article non trouvé' });
      } else {
        res.json(results.rows[0]);
      }
    }
  });
});

export default articlesRoutes;
