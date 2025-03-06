import React, { useState, useEffect } from "react";
import Papa from "papaparse";

interface AdditionProps {
    data: any[];
    difficulty: string;
    updateHighScore: (score: number, game: string) => void;
}

const Subtraktion: React.FC<AdditionProps> = ({ data, difficulty, updateHighScore }) => {
    const [num1, setNum1] = useState<number | null>(null);
    const [num2, setNum2] = useState<number | null>(null);
    const [userAnswer, setUserAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const totalRounds = 10;
    const [gameOver, setGameOver] = useState(false);



    const getRandomNumbers = () => {
        if (data.length >= 20) {
            let maxNum = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 100;

            let newNum1 = Math.floor(Math.random() * maxNum) + 1;
            let newNum2 = Math.floor(Math.random() * maxNum) + 1;

            setNum1(newNum1);
            setNum2(newNum2);
        }
    };

    useEffect(() => {
        if (data.length > 1) {
            getRandomNumbers();
        }
    }, [data]);

    const checkAnswer = () => {
        if (num1 === null || num2 === null) return; 

        const correctAnswer = num1 - num2;

        if (parseInt(userAnswer) === correctAnswer) {
            let points = difficulty === "easy" ? 1 : difficulty === "medium" ? 3 : 5;
            setScore((prevScore) => prevScore + points);
            setMessage("✅ Rätt svar!");
        } else {
            setMessage(`❌ Fel! Rätt svar var ${correctAnswer}`);
        }

        if (round < totalRounds) {
            setRound((prevRound) => prevRound + 1);
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
                    {num1 !== null && num2 !== null ? (
                        <p>{num1} - {num2} = ?</p>
                    ) : (
                        <p>⏳ Laddar fråga...</p>
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

export default Subtraktion;
