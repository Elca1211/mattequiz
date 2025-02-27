import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class MultiplicationGame {
  private correctAnswers: number[] = [];
  private wrongAnswers: number[] = [];
  private questions: { question: string; correctAnswer: number }[] = [];
  private numQuestions: number = 7; // Standardantal frågor
  private minNumber: number = 1;
  private maxNumber: number = 5;

  constructor() {
    this.askForLevel();
  }

  private askForLevel() {
    console.log(
      "Välj en nivå:\n1 - Lätt (1-5:ans tabell, 7 frågor)\n2 - Medel (1-7:ans tabell, 7 frågor)\n3 - Svår (5-10:ans tabell, 10 frågor)"
    );
    rl.question("Ange nivå (1, 2 eller 3): ", (level) => {
      switch (level.trim()) {
        case "1":
          this.minNumber = 1;
          this.maxNumber = 5;
          this.numQuestions = 7;
          break;
        case "2":
          this.minNumber = 1;
          this.maxNumber = 7;
          this.numQuestions = 7;
          break;
        case "3":
          this.minNumber = 5;
          this.maxNumber = 10;
          this.numQuestions = 10;
          break;
        default:
          console.log("Ogiltigt val, försök igen.");
          return this.askForLevel();
      }

      this.generateQuestions();
      this.start();
    });
  }

  private generateQuestions() {
    for (let i = 0; i < this.numQuestions; i++) {
      const num1 =
        Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) +
        this.minNumber;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const question = `${num1} * ${num2} = ?`;
      this.questions.push({ question, correctAnswer: num1 * num2 });
    }
  }

  private askQuestion(index: number) {
    if (index >= this.questions.length) {
      this.showResults();
      rl.close();
      return;
    }

    const { question, correctAnswer } = this.questions[index];
    rl.question(question + " ", (answer) => {
      const userAnswer = parseInt(answer, 10);
      if (userAnswer === correctAnswer) {
        this.correctAnswers.push(userAnswer);
      } else {
        this.wrongAnswers.push(userAnswer);
      }
      this.askQuestion(index + 1);
    });
  }

  public start() {
    console.log("\nDags att spela! Svara på frågorna:");
    this.askQuestion(0);
  }

  private showResults() {
    console.log("\nSpelet är slut! Här är dina resultat:");
    console.log(`Antal rätt: ${this.correctAnswers.length}`);
    console.log(`Antal fel: ${this.wrongAnswers.length}`);
  }
}

// Startar spelet
new MultiplicationGame();
