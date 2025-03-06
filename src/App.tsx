import React, { useState, useEffect } from "react";
import "./App.css";
import MultiplicationGame from "./components/MultiplicationGame";
import useFetch from "./hooks/useFetch";
import TableMultiplication from "./components/TableMultiplication";
import Addition from "./components/Addition";
import Subtraktion from "./components/Subtraktion";
import Division from "./components/Division";

const App: React.FC = () => {
  const [option, setOption] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [inputName, setInputName] = useState<string>(""); // Lokalt state för input
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [highScores, setHighScores] = useState<{ [key: string]: number }>({});
  const { fetchCsvData } = useFetch();

  useEffect(() => {
    fetchCsvData('/mathdata.csv', setData);
  }, []);
  
  const updateHighScore = (score: number) => {
    if (username) {
      setHighScores((prevScores) => {
        const currentScore = prevScores[username] || 0;
        return {
          ...prevScores,
          [username]: Math.max(currentScore, score),
        };
      });
    }
  };

  return (
    <div className="App">
      {!username ? (
        <div className="username-container">
          <h2>Välj ditt användarnamn</h2>
          <input
            type="text"
            placeholder="Skriv ditt namn"
            value={inputName} // Sätter värdet från local state
            onChange={(e) => setInputName(e.target.value)} // Uppdaterar local state
          />
          <button onClick={() => setUsername(inputName.trim())}>Starta spelet</button>
        </div>
      ) : !option ? (
        <>
          <h1 className="heading">Välkommen, {username}!</h1>
          <h2 className="subtitle">Välj svårighetsgrad:</h2>
          <div className="difficulty-menu">
            <button onClick={() => setDifficulty("easy")}>Lätt</button>
            <button onClick={() => setDifficulty("medium")}>Medel</button>
            <button onClick={() => setDifficulty("hard")}>Svår</button>
          </div>

          <h2 className="subtitle">Välj ett spel:</h2>
          <div className="menu">
            <button onClick={() => setOption("multiplikation")}>Multiplikation</button>
            <button onClick={() => setOption("tabeller")}>Multiplikationstabellerna</button>
            <button onClick={() => setOption("division")}>Division</button>
            <button onClick={() => setOption("addition")}>Addition</button>
            <button onClick={() => setOption("subtraktion")}>Subtraktion</button>
          </div>

          {/* Highscore-tavla */}
          <div className="highscore-container">
            <h3>🏆 Highscore</h3>
            {Object.entries(highScores).map(([user, score]) => (
              <p key={user}>{user}: {score} poäng</p>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="back-button" onClick={() => setOption(null)}>
            ⬅ Tillbaka till menyn
          </button>
          {option === "multiplikation" && <MultiplicationGame data={data} difficulty={difficulty} updateHighScore={updateHighScore} />}
          {option === "tabeller" && <TableMultiplication data={data} />}
          {option === "division" && <Division data={data} difficulty={difficulty} updateHighScore={updateHighScore} />}
          {option === "addition" && <Addition data={data} difficulty={difficulty} updateHighScore={updateHighScore} />}
          {option === "subtraktion" && <Subtraktion data={data} difficulty={difficulty} updateHighScore={updateHighScore} />}
        </>
      )}
    </div>
  );
}

export default App;