import React, { useState, useEffect } from "react";

interface MultiplicationGameProps {
  difficulty: string;
  updateHighScore: (score: number, game: string) => void;
}

const MultiplicationGame: React.FC<MultiplicationGameProps> = ({ difficulty, updateHighScore }) => {
  const [num1, setNum1] = useState(1);
  const [num2, setNum2] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const totalRounds = 10;
  const points = difficulty === "easy" ? 1 
                  : difficulty === "medium" ? 3 
                  : 5;


  const getRandomNumbers = () => {
    const maxNum = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 100;
    setNum1(Math.floor(Math.random() * maxNum) + 1);
    setNum2(Math.floor(Math.random() * maxNum) + 1);
  };
  
  useEffect(getRandomNumbers, []);

  const checkAnswer = () => {
    if (gameOver) return;
    const correctAnswer = num1 * num2;
    const isCorrect = parseInt(userAnswer) === correctAnswer;

    setMessage(isCorrect 
                ? "✅ Rätt svar!" 
                : `❌ Fel! Rätt svar var ${correctAnswer}`
              );
    
    let newScore = score;
    if (isCorrect) {
      newScore += points;
      setScore(newScore);
    }
    if (round < totalRounds) {
      setRound(prev => prev + 1);
      getRandomNumbers();
      setUserAnswer("");
  } else {
      setGameOver(true);  // Sätt gameOver när sista frågan är besvarad
      updateHighScore(newScore, "Multiplication");  // Spara highscore
  }
};

  const restartGame = () => {
    setScore(0);
    setRound(1);
    setMessage("");
    setGameOver(false);
    getRandomNumbers();
  };

  return (
    <div className="game-frame-container">
    <div className="game-container">
      {gameOver ? (
        <div>
          <h2>🎮 Game Over! 🎉</h2>
          <p>Du fick {score} poäng!</p>
          <button onClick={restartGame}>🔄 Spela igen</button>
        </div>
      ) : (
        <>
          <h2>Fråga {round}/{totalRounds}</h2>
          <p>{num1} × {num2} = ?</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          />
          <button onClick={checkAnswer}>Svara</button>
          <p>{message}</p>
          <p>Poäng: {score}</p>
        </>
      )}
      </div>
    </div>
  );
};

export default MultiplicationGame;
