import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;

const { Pool } = pg;

// Configuration de la connexion à la base de données
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bdg',
  password: 'miyavi',
  port: 5432 // Port de la base de données PostgreSQL
});

// Route pour récupérer tous les articles
app.get('/articles', (req, res) => {
  pool.query('SELECT * FROM articles', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des articles', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(results.rows);
    }
  });
});

// Route pour récupérer un article par son ID
app.get('/articles/:id', (req, res) => {
  const articleId = req.params.id;
  pool.query('SELECT * FROM articles WHERE id = $1', [articleId], (error, results) => {
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
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
