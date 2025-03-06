import React, { useState } from "react";

interface TableMultiplicationProps {
  data: any[];
}

const TableMultiplication: React.FC<TableMultiplicationProps> = ({ data }) => {
  const [table, setTable] = useState<number | null>(null);
  const [num1, setNum1] = useState<number | null>(null);
  const [num2, setNum2] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const totalRounds = 10;
  const [gameOver, setGameOver] = useState(false);

  // När användaren väljer en tabell, starta spelet
  const startGame = (selectedTable: number) => {
    setTable(selectedTable);
    setRound(1);
    setScore(0);
    setMessage("");
    setGameOver(false);
    getRandomNumbers(selectedTable);
  };

  // Slumpar en rad och tar rätt tabellkolumn
  const getRandomNumbers = (selectedTable: number) => {
    if (data.length >= 10) {
      const randomIndex = Math.floor(Math.random() * 10); // Begränsa till index 0-9
      const row = data[randomIndex];

      setNum1(row.num1);
      setNum2(selectedTable); // Hämtar rätt multiplikationstabell
    }
  };

  const checkAnswer = () => {
    if (num1 === null || num2 === null) return;

    const correctAnswer = num1 * (table ?? 1);
    if (parseInt(userAnswer) === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      setMessage("✅ Rätt svar!");
    } else {
      setMessage(`❌ Fel! Rätt svar var ${correctAnswer}`);
    }

    if (round < totalRounds) {
      setRound(round + 1);
      getRandomNumbers(table ?? 1);
      setUserAnswer("");
    } else {
      setGameOver(true);
    }
  };

  return (
    <div className="game-container">
      {!table ? (
        <div>
          <h2>Välj en multiplikationstabell:</h2>
          {Array.from({ length: 11 }, (_, num) => (
            <button key={num} onClick={() => startGame(num)}>{num}</button>
          ))}
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <h2>🎮 Game Over! 🎉</h2>
          <p>Du fick {score} av {totalRounds} rätt.</p>
          <button onClick={() => setTable(null)}>🔄 Spela igen</button>
        </div>
      ) : (
        <>
          <h2>Fråga {round}/{totalRounds}</h2>
          {num1 !== null && num2 !== null ? (
            <p>{num1} × {num2} = ?</p>
          ) : (
            <p>⏳ Laddar fråga...</p>
          )}

        <input
            type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
               if (e.key === "Enter")       
                    e.preventDefault();
                    checkAnswer();
                  }
                }
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
