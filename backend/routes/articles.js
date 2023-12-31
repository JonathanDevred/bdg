import express from 'express';
import { pool } from '../server.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';


const articlesRoutes = express.Router();

articlesRoutes.use(express.json());
articlesRoutes.use(express.urlencoded({ extended: true }));

// FONCTION CREATE

// Configuration de multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier de destination pour les images téléchargées
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

articlesRoutes.post('/', upload.single('image'), async (req, res) => {
  try {
    // Vérifier si le token d'authentification existe dans les en-têtes de la requête
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Authentification requise' });
    }

    // Vérifier et décoder le token pour obtenir l'ID de l'utilisateur
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { title, content, tags } = req.body;
    const imagePath = req.file.path.replace(/\\/g, '/'); // Convertir les barres obliques inverses doubles en barres obliques simples

    // Insérer les données de l'article dans la table "articles"
    const articleQuery = 'INSERT INTO articles (title, content, image, user_id) VALUES ($1, $2, $3, $4) RETURNING id';
    const articleValues = [title, content, imagePath, userId];
    const articleResult = await pool.query(articleQuery, articleValues);

    const articleId = articleResult.rows[0].id;

    // Ajouter les tags associés à l'article dans la table "articles_tags"
    for (const tagId of tags) {
      const articleTagQuery = 'INSERT INTO articles_tags (article_id, tag_id) VALUES ($1, $2)';
      const articleTagValues = [articleId, tagId];
      await pool.query(articleTagQuery, articleTagValues);
    }

    res.status(201).json({ message: 'Article créé avec succès !', articleId });
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    res.status(500).json({ message: 'Problème lors de la création de l\'article.' });
  }
});


// FONCTION READ

// Route pour récupérer tous les articles et leurs tags
articlesRoutes.get('/', (req, res) => {
  pool.query(
    `SELECT a.*, array_agg(t.name) as tags
    FROM articles AS a
    LEFT JOIN articles_tags AS at ON a.id = at.article_id
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

// Route pour obtenir le nombre total d'articles
articlesRoutes.get('/total-articles', (req, res) => {
  pool.query('SELECT COUNT(*) AS totalarticles FROM articles', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération du nombre total d\'articles', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(results.rows[0]);
    }
  });
});

// Route pour récupérer un article par son titre avec les tags inclus
articlesRoutes.get('/:title', (req, res) => {
  const articleTitle = req.params.title;
  pool.query(
    `SELECT a.*, array_agg(t.name) as tags
    FROM articles AS a
    LEFT JOIN articles_tags AS at ON a.id = at.article_id
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
    LEFT JOIN articles_tags AS at ON a.id = at.article_id
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
  const { title, content, user_id } = req.body;
  pool.query(
    'UPDATE articles SET title = $1, content = $2, user_id = $3 WHERE id = $4 RETURNING *',
    [title, content, user_id, articleId], 
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la mise à jour de l\'article', error);
        res.status(500).json({ error: 'Erreur serveur' });
      } else {
        if (results.rowCount === 0) {
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
      if (results.rowCount === 0) {
        res.status(404).json({ error: 'Article non trouvé' });
      } else {
        res.json(results.rows[0]);
      }
    }
  });
});

export default articlesRoutes;
