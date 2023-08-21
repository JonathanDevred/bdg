import express from 'express';
import { pool } from '../server.js';
import sharp from 'sharp'; // Importez sharp
import path from 'path';

const imagesRoutes = express.Router();

// Route pour récupérer une image par son nom de fichier
imagesRoutes.get('/:imageFileName', async (req, res) => {
  const imageFileName = req.params.imageFileName;

  // Requête pour récupérer le chemin d'accès à l'image depuis la base de données
  const imageQuery = 'SELECT image FROM articles WHERE image = $1';
  const imageValues = [imageFileName];

  pool.query(imageQuery, imageValues, async (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de l\'image depuis la base de données', error);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      if (results.rows.length === 0) {
        res.status(404).json({ error: 'Image non trouvée' });
      } else {
        // Récupérer le chemin d'accès à l'image à partir des résultats de la requête
        const imagePath = results.rows[0].image.replace(/\\/g, '/'); // Remplacer les barres obliques inverses

        // Utiliser sharp pour redimensionner l'image à une taille spécifique (par exemple, 800x600)
        try {
          const resizedImage = await sharp(imagePath).resize(400, 200).toBuffer();
          res.set('Content-Type', 'image/jpeg');
          res.send(resizedImage);
        } catch (resizeError) {
          console.error('Erreur lors du redimensionnement de l\'image', resizeError);
          res.status(500).json({ error: 'Erreur serveur lors du redimensionnement de l\'image' });
        }
      }
    }
  });
});

export default imagesRoutes;
