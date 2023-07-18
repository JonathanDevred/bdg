import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

router.post('/', (req, res) => {
  const { email } = req.body;

  // Vérifiez si l'adresse e-mail est valide, effectuez les vérifications supplémentaires si nécessaire

  // Générez un token JWT avec une clé secrète
  const token = jwt.sign({ email }, process.env.JWT_SECRET_PASSWORD_RESET, { expiresIn: '1h' });

  // Enregistrez le token dans la base de données (à adapter selon votre structure de base de données)

  // Envoyez l'e-mail avec le lien de réinitialisation contenant le token
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Réinitialisation de mot de passe',
    html: `<p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p><p><a href="${resetLink}">${resetLink}</a></p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail', error);
      res.status(500).json({ error: 'Une erreur s\'est produite lors de l\'envoi de l\'e-mail.' });
    } else {
      console.log('E-mail envoyé avec succès', info.response);
      res.json({ message: 'Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.' });
    }
  });
});

export default router;
