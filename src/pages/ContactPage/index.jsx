import React, { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header/index';
import NavBar from '../../components/NavBar';
import HomeLinkBlack from '../../components/HomeLink';
import './styles.scss';

const ContactPage = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <HomeLinkBlack />
      <Header />
      <NavBar />
      <main className="contactpage">
        <h1>Contactez-nous</h1>
        <p>Vous pouvez nous contacter en remplissant le formulaire ci-dessous :</p>
        <form onSubmit={handleSubmit}>
          <div className="form-input">
            <label htmlFor="name">Nom :</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-input">
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-input">
            <label htmlFor="message">Message :</label>
            <textarea id="message" name="message" rows="4" required />
          </div>
          <button className='contact-button' type="submit">Envoyer</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
