import React, { useState, useEffect } from "react";
import "./App.css";
import MultiplicationGame from "./components/MultiplicationGame";
import TableMultiplication from "./components/TableMultiplication";
import Addition from "./components/Addition";
import Subtraktion from "./components/Subtraktion";
import Division from "./components/Division";
import useFetch from "./hooks/useFetch"; // Lägg tillbaka CSV-fetching

const App: React.FC = () => {
  const [option, setOption] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [inputName, setInputName] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [highScores, setHighScores] = useState<{ [key: string]: number }>({});
  const [data, setData] = useState<any[]>([]); // ✅ Lägg tillbaka data
  const { fetchCsvData } = useFetch();

  // ✅ Hämta CSV-data vid start
  useEffect(() => {
    fetchCsvData("/mathdata.csv", setData);
  }, []);

  const updateHighScore = (score: number, game: string) => {
    if (username) {
      setHighScores((prevScores) => ({
        ...prevScores,
        [`${username}-${game}`]: Math.max(prevScores[`${username}-${game}`] || 0, score),
      }));
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
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button onClick={() => setUsername(inputName.trim())}>Starta spelet</button>
        </div>
      ) : !option ? (
        <>
          <h1 className="heading">Välkommen, {username}!</h1>

          {/* Sektion 1: Spel med svårighetsnivå */}
          <h2 className="subtitle">Välj svårighetsgrad:</h2>
          <div className="difficulty-menu">
            <button onClick={() => setDifficulty("easy")}>Lätt</button>
            <button onClick={() => setDifficulty("medium")}>Medel</button>
            <button onClick={() => setDifficulty("hard")}>Svår</button>
          </div>

          <h2 className="subtitle">Välj ett spel:</h2>
          <div className="menu">
            <button onClick={() => setOption("multiplikation")}>Multiplikation</button>
            <button onClick={() => setOption("division")}>Division</button>
            <button onClick={() => setOption("addition")}>Addition</button>
            <button onClick={() => setOption("subtraktion")}>Subtraktion</button>
          </div>

          {/* Sektion 2: Multiplikationstabeller (Egen kategori) */}
          <h2 className="subtitle">Multiplikationstabeller</h2>
          <div className="menu">
            <button onClick={() => setOption("tabeller")}>Öva på multiplikationstabeller</button>
          </div>

          {/* Highscore-tavla */}
          <div className="highscore-container">
            <h3>🏆 Highscore</h3>
            {Object.entries(highScores).map(([userGame, score]) => (
              <p key={userGame}>{userGame.replace("-", " - ")}: {score} poäng</p>
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
