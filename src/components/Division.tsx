import React, { useState, useEffect } from "react";

interface DivisionProps {
  data: any[];
  difficulty: string;
  updateHighScore: (score: number, game: string) => void;
}

const Division: React.FC<DivisionProps> = ({ data, difficulty, updateHighScore }) => {
  const [num1, setNum1] = useState<number | null>(null);
  const [num2, setNum2] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const totalRounds = 10;
  const [gameOver, setGameOver] = useState(false);

  // Slumpar två tal där num1 är en multipel av num2 för att säkerställa att divisionen ger ett heltal
  const getRandomNumbers = () => {
    if (data.length >= 10) {
      let maxNum = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 100;

      let divisor = Math.floor(Math.random() * (maxNum / 2)) + 1; // Undviker 0 och små tal
      let dividend = divisor * (Math.floor(Math.random() * 10) + 1); // Skapar en multipel

      setNum1(dividend);
      setNum2(divisor);
    }
  };

  useEffect(() => {
    if (data.length > 1) {
      getRandomNumbers();
    }
  }, [data]);

  const checkAnswer = () => {
    if (num1 === null || num2 === null) return;

    const correctAnswer = num1 / num2;
    if (parseInt(userAnswer) === correctAnswer) {
      let points = difficulty === "easy" ? 1 : difficulty === "medium" ? 3 : 5;
      setScore((prevScore) => prevScore + points);
      setMessage("✅ Rätt svar!");
    } else {
      setMessage(`❌ Fel! Rätt svar var ${correctAnswer}`);
    }

    if (round < totalRounds) {
      setRound((prevRound) => prevRound + 1);
      getRandomNumbers();
      setUserAnswer("");
    } else {
      setGameOver(true);
      updateHighScore(score, "Division");
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
          {num1 !== null && num2 !== null ? (
            <p>{num1} ÷ {num2} = ?</p>
          ) : (
            <p>⏳ Laddar fråga...</p>
          )}

            <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            checkAnswer();
                        }
                    }}
          />
          <button onClick={checkAnswer}>Svara</button>
          <p>{message}</p>
          <p>Poäng: {score}</p>
        </>
      )}
    </div>
  );
};

export default Division;
