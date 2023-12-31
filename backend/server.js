import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import articlesRoutes from './routes/articles.js';
import tagsRoutes from './routes/tags.js';
import usersRoutes from './routes/users.js';
import commentsRoutes from './routes/comments.js';
import authRoutes from './routes/auth.js';
import forgotRoutes from './routes/forgot.js'; 
import recoverRoutes from './routes/recover.js';
import imagesRoutes from './routes/images.js';

dotenv.config();

const app = express();

const { Pool } = pg;

// Configuration de  la connexion à la base de données
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.PORT,
  password: process.env.DB_PASSWORD
});

// Middleware pour gérer les CORS
app.use(cors());

// Middleware pour analyser les corps des requêtes en tant que JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route d'authentification
app.use('/auth', authRoutes);

// Routes pour la récupération du mot de passe
app.use('/forgot', forgotRoutes);
app.use('/recover', recoverRoutes);

// Routes Blog
app.use('/articles', articlesRoutes);
app.use('/images', imagesRoutes)
app.use('/tags', tagsRoutes);
app.use('/users', usersRoutes);
app.use('/comments', commentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

export { pool };
