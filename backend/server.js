import express from 'express';
import pg from 'pg';
import articlesRoutes from './routes/articles.js';
import tagsRoutes from './routes/tags.js';
import usersRoutes from './routes/users.js';
import commentsRoutes from './routes/comments.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import forgotRoutes from './routes/forgot.js'; 
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

const { Pool } = pg;

// Configuration de la connexion à la base de données
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD
});

// Middleware pour gérer les CORS
app.use(cors());

// Middleware pour analyser les corps des requêtes en tant que JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route d'authentification
app.use('/auth', authRoutes);

// Route pour la récupération du mot de passe
app.use('/forgot', forgotRoutes);

// Routes Blog
app.use('/articles', articlesRoutes);
app.use('/tags', tagsRoutes);
app.use('/users', usersRoutes);
app.use('/comments',commentsRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

export { pool };
