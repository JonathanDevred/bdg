import React, { useState, useEffect } from 'react';
import './SnakeGame.scss';

const SnakeGame = () => {
  const gridSize = 20;
  const initialSnake = [{ x: 5, y: 5 }];
  const initialApple = { x: 10, y: 10 };

  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
      if (gameOver) return;

      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      newSnake.unshift(head);

      if (head.x === apple.x && head.y === apple.y) {
        setApple(generateRandomApple(newSnake));
      } else {
        newSnake.pop();
      }

      if (isCollision(newSnake)) {
        setGameOver(true);
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, 200);

    return () => {
      clearInterval(gameInterval);
    };
  }, [snake, direction, gameOver]);

  const generateRandomApple = (snakeBody) => {
    let newApple;

    do {
      newApple = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snakeBody.some((part) => part.x === newApple.x && part.y === newApple.y));

    return newApple;
  };

  const isCollision = (snakeBody) => {
    const head = snakeBody[0];
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true; // Collision avec un mur
    }

    return snakeBody.slice(1).some((part) => part.x === head.x && part.y === head.y);
  };

  const handleRetry = () => {
    setSnake(initialSnake);
    setApple(initialApple);
    setDirection('RIGHT');
    setGameOver(false);
  };

  return (
    <div className="snake-game">
      <div className="grid">
        {Array.from({ length: gridSize }).map((_, y) =>
          Array.from({ length: gridSize }).map((_, x) => (
            <div
              key={`${x}-${y}`}
              className={`cell ${
                snake.some((part) => part.x === x && part.y === y)
                  ? 'snake'
                  : apple.x === x && apple.y === y
                  ? 'apple'
                  : ''
              }`}
            ></div>
          ))
        )}
      </div>
      {gameOver && (
        <div className="game-over">
          <p>Game Over!</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
