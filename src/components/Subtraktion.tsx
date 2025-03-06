import React, { useState, useEffect } from "react";

interface SubtraktionProps {
    difficulty: string;
    updateHighScore: (score: number, game: string) => void;
}

const Subtraktion: React.FC<SubtraktionProps> = ({ difficulty, updateHighScore }) => {
    const [num1, setNum1] = useState(1);
    const [num2, setNum2] = useState(1);
    const [userAnswer, setUserAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const totalRounds = 10;
    const [gameOver, setGameOver] = useState(false);

    const getRandomNumbers = () => {
        const maxNum = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 100;
        let newNum1 = Math.floor(Math.random() * maxNum) + 1;
        let newNum2 = Math.floor(Math.random() * maxNum) + 1;

        // Se till att num1 alltid är större än eller lika med num2 (ingen negativ subtraktion)
        if (newNum2 > newNum1) [newNum1, newNum2] = [newNum2, newNum1];

        setNum1(newNum1);
        setNum2(newNum2);
    };
    useEffect(() => {
        getRandomNumbers();
    }, []);

    const checkAnswer = () => {
        if (parseInt(userAnswer) === num1 - num2) {
            setScore((prev) => prev + (difficulty === "easy" ? 1 : difficulty === "medium" ? 3 : 5));
            setMessage("✅ Rätt svar!");
        } else {
            setMessage(`❌ Fel! Rätt svar var ${num1 - num2}`);
        }

        if (round < totalRounds) {
            setRound((prev) => prev + 1);
            getRandomNumbers();
            setUserAnswer("");
        } else {
            setGameOver(true);
            updateHighScore(score, "Subtraktion");
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
                    <p>{num1} - {num2} = ?</p>
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                    />
                    <button onClick={checkAnswer}>Svara</button>
                    <p>{message}</p>
                    <p>Poäng: {score}</p>
                </>
            )}
        </div>
    );
};

export default Subtraktion;
