import React, { useState } from "react";

interface TableMultiplicationProps {
  data: number | string[];
}

const TableMultiplication: React.FC<TableMultiplicationProps> = () => {
  const [table, setTable] = useState<number | null>(null);
  const [questionQueue, setQuestionQueue] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const startGame = (selectedTable: number) => {
    setTable(selectedTable);
    setQuestionQueue(Array.from({ length: 10 }, (_, i) => i + 1)); // Skapar en kö med talen 1-10
    setScore(0);
    setMessage("");
    setGameOver(false);
    setUserAnswer("");
  };

  const checkAnswer = () => {
    if (table === null || questionQueue.length === 0) return;

    const currentMultiplier = questionQueue[0]; // Tar första talet i kön
    const correctAnswer = table * currentMultiplier;

    if (parseInt(userAnswer) === correctAnswer) {
      setScore((prev) => prev + 1);
      setMessage("✅ Rätt svar!");
    } else {
      setMessage(`❌ Fel! Rätt svar var ${correctAnswer}`);
    }

    setUserAnswer(""); // Rensa input

    // Ta bort det första elementet i kön (nästa fråga)
    const newQueue = questionQueue.slice(1);
    setQuestionQueue(newQueue);

    // Om kön är tom, avsluta spelet
    if (newQueue.length === 0) {
      setGameOver(true);
    }
  };


  const restartGame = () => {
    setTable(null);
    setScore(0);
    setQuestionQueue([]);
    setMessage("");
    setGameOver(false);
  };

  return (
    <div className="game-frame-container">
      {!table ? (
         <div className="table-selection-container">
         <h2>Välj en multiplikationstabell</h2>
         <div className="table-buttons">
           {[...Array(10)].map((_, num) => (
             <button key={num + 1} onClick={() => startGame(num + 1)}>
               Tabell {num + 1}
             </button>
          ))}
        </div>
      </div>
       ) : gameOver ? (
        <div className="game-over">
          <h2>🎮 Game Over! 🎉</h2>
          <p>Du fick {score} av 10 rätt.</p>
          <button onClick={restartGame}>🔄 Spela igen</button>
        </div>
      ) : (
        <>
          <h2>Fråga {10 - questionQueue.length + 1}/10</h2>
          <p>{table} × {questionQueue[0]} = ?</p>

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
