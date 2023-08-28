import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Footer from '../../components/Footer';
import Header from '../../components/Header/index';
import NavBar from '../../components/NavBar';
import HomeLinkBlack from '../../components/HomeLink';
import './styles.scss';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await emailjs.sendForm('service_hfli5fo', 'template_jxlrr04', event.target, 'xWvW2MKLu6AalCn9s');
      setIsMessageSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  return (
    <div>
      <HomeLinkBlack />
      <Header />
      <NavBar />
      <main className="contactpage">
        <h1>Contactez-nous</h1>
        <p>Une question, une remarque ?</p>
        <p>Vous pouvez nous contacter en remplissant le formulaire ci-dessous :</p>
        <form className='contact-form' onSubmit={handleSubmit}>
          <div className="form-input">
            <label htmlFor="name">Nom :</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-input">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-input">
            <label htmlFor="message">Message :</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          {isMessageSent && (
            <p className="success-message">Message envoyé avec succès !</p>
          )}
          <button className='contact-button' type="submit">Envoyer</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
