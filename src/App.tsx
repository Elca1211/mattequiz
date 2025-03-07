import React, { useState, useEffect } from "react";
import "./App.css";
import MultiplicationGame from "./components/MultiplicationGame";
import TableMultiplication from "./components/TableMultiplication";
import Addition from "./components/Addition";
import Subtraktion from "./components/Subtraktion";
import Division from "./components/Division";
import useFetch from "./hooks/useFetch"; // Lägg tillbaka CSV-fetching

// FROM LECTURE 8B men med arrays ist för lists
// IMMUTABLE FIFO QUEUE IMPLEMENTATION
type NonEmptyQueue<T> = [T, Queue<T>];
type Queue<T> = null | NonEmptyQueue<T>;

// Skapar en tom kö
function empty<T>(): Queue<T> {
  return null;
}

// Kollar om kön är tom
function is_empty<T>(q: Queue<T>): q is null {
  return q === null;
}

// Lägger till ett element sist i kön (villkor för att få fallande ordning)
function enqueue<T>(e: T, q: Queue<T>): NonEmptyQueue<T> {
  if (q === null) return [e, null];

  // Om nya värdet är större än första värdet, sätt det först
  if (e > q[0]) return [e, q];

  // Annars, fortsätt till nästa position
  return [q[0], enqueue(e, q[1])];
}

// Hämtar första elementet (head)
function head<T>(q: NonEmptyQueue<T>): T {
  return q[0];
}

// Tar bort första elementet i kön (dequeue)
function dequeue<T>(q: NonEmptyQueue<T>): Queue<T> {
  return q[1];
}

const App: React.FC = () => {
  const [option, setOption] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [inputName, setInputName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [highScores, setHighScores] = useState<{ [key: string]: Queue<number> }>({});
  const [data, setData] = useState<any[]>([]); // ✅ Lägg tillbaka data
  const { fetchCsvData } = useFetch();

  // ✅ Hämta CSV-data vid start
  useEffect(() => {
    fetchCsvData("/mathdata.csv", setData);
  }, []);
  
  const MAX_HIGHSCORES = 5;


  const updateHighScore = (score: number, game: string) => {
    if (!username) return;
  
    setHighScores((prevScores) => {
      const key = `${username}-${game}`;
      
      let q: Queue<number> = prevScores[key] ?? empty<number>(); // Använd empty queue om nyckeln inte finns
  
      q = enqueue(score, q); 
  
      // Begränsa antalet highscores till MAX_HIGHSCORES
      let temp = q;
      let count = 1;
      while (temp[1] !== null) {
        temp = temp[1];
        count++;
      }
      if (count > MAX_HIGHSCORES) {
        q = dequeue(q as NonEmptyQueue<number>); // Ta bort första elementet om kön är för stor
      }
  
      const updatedScores = { ...prevScores, [key]: q };
  
      localStorage.setItem("highScores", JSON.stringify(updatedScores)); // Spara i localStorage
      
      return updatedScores;
    });
  };
  

  useEffect(() => {
    const savedScores = localStorage.getItem("highScores");
    if (savedScores) {
      try {
        const parsed = JSON.parse(savedScores);
        setHighScores(parsed as { [key: string]: Queue<number> });
      } catch (e) {
        console.error("Fel vid laddning av highscore:", e);
      }
    }
  }, []);

  return (
    <div className="App">
      {!username ? (
        <div className="username-container">
          <h1 className="first-heading">Välj ditt användarnamn</h1>
          <input
            type="text"
            placeholder="Skriv ditt namn"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button 
            onClick={() => setUsername(inputName.trim())}>Starta spelet</button>
        </div>
      ) : !option ? (
        <>
          <div className="main-container">
  <div className="content-container">
    <h1 className="heading">VÄLKOMMEN, {username}!</h1>

    <h2 className="subtitle">Välj svårighetsgrad:</h2>
    <div className="difficulty-menu">
  <button 
    className={difficulty === "easy" ? "selected easy-btn" : "easy-btn"} 
    onClick={() => setDifficulty("easy")}
  >
    Lätt
  </button>
  <button 
    className={difficulty === "medium" ? "selected medium-btn" : "medium-btn"} 
    onClick={() => setDifficulty("medium")}
  >
    Medel
  </button>
  <button 
    className={difficulty === "hard" ? "selected hard-btn" : "hard-btn"} 
    onClick={() => setDifficulty("hard")}
  >
    Svår
  </button>
</div>



    <h2 className="subtitle">Välj ett spel:</h2>
    <div className="menu">
      <button onClick={() => setOption("multiplikation")}>Multiplikation</button>
      <button onClick={() => setOption("division")}>Division</button>
      <button onClick={() => setOption("addition")}>Addition</button>
      <button onClick={() => setOption("subtraktion")}>Subtraktion</button>
    </div>

    <h2 className="subtitle">Övningar</h2>
    <div className="menu">
      <button onClick={() => setOption("tabeller")}>Öva på multiplikationstabeller</button>
    </div>
  </div>

</div>

          {/* Highscore-tavla */}
          <div className="highscore-container">
            <h3>🏆 Highscore</h3>
            {Object.entries(highScores).map(([userGame, q]) => (
              <div key={userGame}>
                <strong>{userGame.replace("-", " - ")}:</strong>
                <ul>
                  {(() => {
                    let scores: number[] = [];
                    let temp = q;
                  while (temp !== null) {
                    scores.push(head(temp));
                    temp = dequeue(temp);
                  }
                  return scores.map((s, index) => <li key={index}>{s} poäng</li>);
                })()}
              </ul>
            </div>
          ))}
        </div>
        </>
      ) : (
        <>
          <button className="back-button" onClick={() => setOption(null)}>
            ⬅ Tillbaka till menyn
          </button>
          {option === "multiplikation" && <MultiplicationGame difficulty={difficulty} updateHighScore={updateHighScore} />}
          {option === "division" && <Division difficulty={difficulty} updateHighScore={updateHighScore} />}
          {option === "addition" && <Addition difficulty={difficulty} updateHighScore={updateHighScore} />}
          {option === "subtraktion" && <Subtraktion difficulty={difficulty} updateHighScore={updateHighScore} />}
          {option === "tabeller" && <TableMultiplication data={data} />} {/* ✅ Nu finns data */}
        </>
      )}
    </div>
  );
};

export default App;
