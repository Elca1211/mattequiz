import React, { useState } from "react";
import "./App.css";
import InputField from "./components/InputField";
import MultiplicationGame from "./components/MultiplicationGame";

const App: React.FC = () => {
  const [option, setOption] = useState<string | null>(null);

  return (
    <div className="App">

      {!option ? (
        <>
          <h1 className = "heading">Välkommen till Mattespelet!</h1>
          <h2 className = "subtitle">Vad vill du spela?</h2>

      <div className="menu">
        <button onClick={() => setOption("multiplikation")}>Multiplikation</button>
        <button onClick={() => setOption("division")}>Division</button>
        <button onClick={() => setOption("addition")}>Addition</button>
        <button onClick={() => setOption("subtraktion")}>Subtraktion</button>
      </div>
      </>
    ) : (
      <>
       <button className="back-button" onClick={() => setOption(null)}>
            ⬅ Tillbaka till menyn
          </button>
        {option === "multiplikation" && <MultiplicationGame/>}
      </>
      )}
    </div>
  );
}

export default App;