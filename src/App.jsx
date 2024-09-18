import { useState, useEffect, useRef } from 'react';
import './index.css';

// Paleta de colores
const colors = ['green', 'red', 'yellow', 'blue'];

function App() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isGameOn, setIsGameOn] = useState(false);
  const [flashIndex, setFlashIndex] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [gameMessage, setGameMessage] = useState('Click Start to play');
  const [score, setScore] = useState(0);

  const flashInterval = useRef(null);

  // Generar una nueva secuencia al comenzar el juego
  useEffect(() => {
    if (isGameOn) {
      generateSequence();
    }
  }, [isGameOn]);

  // Manejar el parpadeo de la secuencia
  useEffect(() => {
    const flashSequence = () => {
      flashInterval.current = setInterval(() => {
        if (flashIndex < sequence.length) {
          const color = sequence[flashIndex];
          const button = document.querySelector(`.${color}`);
          if (button) {
            button.classList.add('flash');
            setTimeout(() => {
              button.classList.remove('flash');
            }, 500);
          }
          setFlashIndex(prevIndex => prevIndex + 1);
        } else {
          clearInterval(flashInterval.current);
          setFlashIndex(0);
          setIsFlashing(false);
        }
      }, 1000);
    };

    if (isFlashing) {
      flashSequence();
    }

    return () => clearInterval(flashInterval.current);
  }, [isFlashing, flashIndex, sequence]);

  // Función para generar una nueva secuencia
  const generateSequence = () => {
    setSequence(prevSequence => [
      ...prevSequence,
      colors[Math.floor(Math.random() * colors.length)]
    ]);
    setUserSequence([]);
    setIsFlashing(true);
  };

  // Función para manejar el clic en los botones de color
  const handleColorClick = (color) => {
    if (isFlashing) return;

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequence.length) {
      if (newUserSequence.every((val, index) => val === sequence[index])) {
        setGameMessage('Correct!');
        setScore(score + 1); // Incrementa el puntaje
        setTimeout(() => {
          setGameMessage('Next round...');
          generateSequence();
        }, 2000); // Muestra "Correct!" por 2 segundos
      } else {
        setGameMessage(`Game Over! Final score: ${score}`);
        setIsGameOn(false);
        setSequence([]);
        setScore(0); // Reiniciar puntaje
      }
    }
  };

  return (
    <div className="container">
      <div className="info">
        <h1>Simon Dice</h1>
        <p>{gameMessage}</p>
        <p>Puntuación: {score}</p> {/* Mostrar la puntuación */}
        <button onClick={() => setIsGameOn(true)}>Start</button>
        <button onClick={() => {
          setIsGameOn(false);
          setSequence([]);
          setUserSequence([]);
          setGameMessage('Click Start to play');
          setScore(0); // Reinicia la puntuación
        }}>Reset</button>
      </div>
      <div className="game-board">
        {colors.map(color => (
          <button
            key={color}
            className={`button ${color}`}
            onClick={() => handleColorClick(color)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
