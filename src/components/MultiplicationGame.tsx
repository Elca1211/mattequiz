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
    const correctAnswer = num1 * num2;
    setMessage(parseInt(userAnswer) === correctAnswer 
                                    ? "✅ Rätt svar!" 
                                    : `❌ Fel! Rätt svar var ${correctAnswer}`);
    if (parseInt(userAnswer) === correctAnswer) setScore((prev) => prev + points);



    if (round < totalRounds) {
      setRound(round + 1);
      getRandomNumbers();
      setUserAnswer("");
    } else {
      setGameOver(true);
      updateHighScore(score, "Multiplikation");
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
    <div className="game-container">
      {gameOver ? (
        <div className="game-over">
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
  );
};

export default MultiplicationGame;
