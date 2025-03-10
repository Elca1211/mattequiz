import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

// FIFO-kö implenteras 
type NonEmptyQueue<T> = [T, Queue<T>];
type Queue<T> = null | NonEmptyQueue<T>;

// QUEUE functions 
function empty<T>(): Queue<T> {
  return null;
}

function is_empty<T>(q: Queue<T>): q is null {
  return q === null;
}

function enqueue<T>(e: T, q: Queue<T>): NonEmptyQueue<T> {
  if (q === null) return [e, null];
  return [q[0], enqueue(e, q[1])];
}

function head<T>(q: NonEmptyQueue<T>): T {
  return q[0];
}

function dequeue<T>(q: NonEmptyQueue<T>): Queue<T> {
  return q[1];
}

interface TableMultiplicationProps {
  data: any[];
}

const TableMultiplication: React.FC <{ data: any[] }> = ({ data }) => {
  const { fetchCsvData } = useFetch();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [questionQueue, setQuestionQueue] = useState<Queue<[number, number]>>(empty());
  const [userAnswer, setUserAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const totalRounds = 10;

  // Hämta CSV-fil vid start
  useEffect(() => {
    fetchCsvData("/mathdata.csv", setCsvData);
  }, []);

  useEffect(() => {
    if (selectedTable && csvData.length > 0) {
      // Raden nedan hämtar number (kolumn 1) och den valda tabellens värden från CSV filen och lagrar som array par.
      const newQueue = csvData.map((row: any) => [row.number, row[selectedTable]]) as [number, number][]; 
      let q: Queue<[number, number]> = empty();
      newQueue.forEach(pair => (q = enqueue(pair, q)));
      setQuestionQueue(q);
    }
  }, [selectedTable, csvData]);
  
  const checkAnswer = () => {
    if (is_empty(questionQueue)) return;

    const [num1, num2] = head(questionQueue);
    const correctAnswer = num1 * num2;

    if (parseInt(userAnswer) === correctAnswer) {
      setScore((prev) => prev + 1);
      setMessage("✅ Rätt svar!");
    } else {
      setMessage(`❌ Fel! Rätt svar var ${correctAnswer}`);
    }

    setUserAnswer("");
    setQuestionQueue(dequeue(questionQueue as NonEmptyQueue<[number, number]>));

    if (round < totalRounds) {
      setRound(round + 1);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setSelectedTable(null);
    setScore(0);
    setRound(1);
    setMessage("");
    setGameOver(false);
    setQuestionQueue(empty());
  };

  return (
    <div className="game-container">
      {!selectedTable ? (
        <div>
          <h2>Välj en multiplikationstabell:</h2>
          {[...Array(10)].map((_, num) => (
            // här välj den aktuella tabellen ut från csv filen (som sedan används i newQueue)
            <button key={num + 1} onClick={() => setSelectedTable(`table${num + 1}`)}>
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
          <h2>Fråga {round}/{totalRounds}</h2>
          {!is_empty(questionQueue) && (
            <p>{head(questionQueue)[0]} × {head(questionQueue)[1]} = ?</p>
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

export default TableMultiplication;