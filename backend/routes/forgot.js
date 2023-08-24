import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const forgotRoutes = express.Router();

forgotRoutes.post('/forgot', async (req, res) => {
  const { email } = req.body;

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: 'L\'adresse e-mail est invalide.' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET_PASSWORD_RESET, { expiresIn: '1h' });

  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: MAIL_USER,
        pass: MAIL_PSD,
      },
    });

    const mailOptions = {
      from: MAIL_USER,
      to: email,
      subject: 'Réinitialisation de mot de passe',
      html: `<p>Voici le lien de réinitialisation de votre mot de passe : <a href="${token}">${token}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    console.log('E-mail de réinitialisation envoyé à :', email);
    res.json({ message: 'Un e-mail de réinitialisation a été envoyé à votre adresse e-mail.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe', error);
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la réinitialisation du mot de passe.' });
  }
});

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default forgotRoutes;
