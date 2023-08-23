import React, { useState } from 'react';
import './styles.scss';
import SnakeGame from './SnakeGame.jsx';
import HomeLinkBlack from '../../components/HomeLink';

const GameConsole = () => {
  const [powerOn, setPowerOn] = useState(false);

  const handlePowerToggle = () => {
    setPowerOn(!powerOn);
  };

  return (
    <div className="game-console">
        <p>Erreur 404. Ce lien n'existe pas, voilà le lien vers l'accueil, sinon tu peux aussi jouer : </p>
        <HomeLinkBlack />
      <div className={`screen ${powerOn ? 'active' : ''}`}>
        {powerOn ? (
          <div className="game-content">
            <SnakeGame />
          </div>
        ) : (
          <div className="power-off">
            <p>Allumez la console !</p>
            <button onClick={handlePowerToggle}>Power On</button>
          </div>
        )}
      </div>
      <p>Utilise les flèches de ton clavier pour jouer !</p>
    </div>
  );
};

export default GameConsole;
