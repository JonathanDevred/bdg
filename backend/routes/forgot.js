import express from 'express';
import { pool } from '../server.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const forgotRoutes = express.Router();

// Route pour la réinitialisation du mot de passe
forgotRoutes.post('/', async (req, res) => {
  const { email } = req.body;

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'L\'adresse e-mail est invalide.' });
  }

  // On récupère l'utilisateur depuis son mail
  pool.query('SELECT * FROM users WHERE email = $1', [email], async (error, results) => {
    if (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur existant', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results.rows[0];

    // Générer une chaîne aléatoire comme token
    const randomToken = crypto.randomBytes(20).toString('hex');

    // Insérer la chaîne aléatoire dans la table password_reset
    const insertQuery = 'INSERT INTO password_reset (user_id, token) VALUES ($1, $2)';
    await pool.query(insertQuery, [user.id, randomToken]);

    const resetLink = `https://www.leblogdugamer.com/reset-password/${user.id}/${randomToken}`;

    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PSD,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `<p>Bonjour,</p> 
          <p>Voici le lien de réinitialisation de votre mot de passe : <a href="${resetLink}">Réinitialiser le mot de passe</a></p>
          <p>Ce lien est valable pendant 15 minutes.</p>
          <p>L'équipe Blog du Gamer.</p>`,
      };

      await transporter.sendMail(mailOptions);

      console.log('E-mail de réinitialisation envoyé à :', email);
      res.json({ message: 'Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe', error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.' });
    }
  });
});

export default forgotRoutes;
