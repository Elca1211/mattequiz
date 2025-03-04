import React, { useState } from "react";

const MultiplicationGame: React.FC = () => {
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10) + 1);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("");

  const totalRounds = 10;

  const checkAnswer = () => {
    const correctAnswer = num1 * num2;
    if (parseInt(userAnswer) === correctAnswer) {
      setScore(score + 1);
      setMessage("✅ Rätt svar!");
    } else {
      setMessage(`❌ Fel! Rätt svar var ${correctAnswer}`);
    }

    if (round < totalRounds) {
      // Gå till nästa fråga
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setRound(round + 1);
      setUserAnswer("");
    } else {
      // Spelet är slut
      setMessage(`🎉 Spelet är slut! Du fick ${score + (parseInt(userAnswer) === correctAnswer ? 1 : 0)} av ${totalRounds} rätt.`);
    }
  };

  return (
    <><>
          <div className="mult-container">
              <h1>MULTIMÄSTAREN</h1>
          </div>
      </><div className="game-container">
              {round <= totalRounds ? (
                  <>
                      <p>Fråga {round}/{totalRounds}</p>
                      <p>{num1} × {num2} = ?</p>
                      <input
                          type="number"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && checkAnswer()} />
                      <button onClick={checkAnswer}>Svara</button>
                      <p>{message}</p>
                  </>
              ) : (
                  <h2>{message}</h2>
              )}
          </div></>
  );
};

export default MultiplicationGame;
