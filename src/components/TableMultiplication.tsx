import React, { useState } from "react";

interface TableMultiplicationProps {
  data: any[];
}

const TableMultiplication: React.FC<TableMultiplicationProps> = ({ data }) => {
  const [table, setTable] = useState<number | null>(null);
  const [i, setI] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const totalRounds = 10;
  const [gameOver, setGameOver] = useState(false);

  const startGame = (selectedTable: number) => {
    setTable(selectedTable);
    setI(0);
    setScore(0);
    setMessage("");
    setGameOver(false);
    setUserAnswer("");
  };

  const checkAnswer = () => {
    if (table === null || i >= totalRounds) return;

    const correctAnswer = table * (i + 1);
    if (parseInt(userAnswer) === correctAnswer) {
      setScore((prev) => prev + 1);
      setMessage("✅ Rätt svar!");
    } else {
      setMessage(`❌ Fel! Rätt svar var ${correctAnswer}`);
    }

    setUserAnswer(""); // Rensa input

    if (i < totalRounds - 1) {
      setI((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setTable(null);
    setScore(0);
    setI(0);
    setMessage("");
    setGameOver(false);
  };

  return (
    <div className="game-container">
      {!table ? (
        <div>
          <h2>Välj en multiplikationstabell:</h2>
          {[...Array(10)].map((_, num) => (
            <button key={num + 1} onClick={() => startGame(num + 1)}>
              Tabell {num + 1}
            </button>
          ))}
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <h2>🎮 Game Over! 🎉</h2>
          <p>Du fick {score} av {totalRounds} rätt.</p>
          <button onClick={restartGame}>🔄 Spela igen</button>
        </div>
      ) : (
        <>
          <h2>Fråga {i + 1}/{totalRounds}</h2>
          <p>{table} × {i + 1} = ?</p>

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

export default TableMultiplication;