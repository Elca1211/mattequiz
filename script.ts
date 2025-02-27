class MultiplicationGame {
  private correctAnswers: number = 0;
  private wrongAnswers: number = 0;
  private questions: { question: string; correctAnswer: number }[] = [];
  private currentIndex: number = 0;
  private numQuestions: number = 7;
  private minNumber: number = 1;
  private maxNumber: number = 5;

  constructor(level: number) {
    this.setLevel(level);
    this.generateQuestions();
    this.showQuestion();
  }

  private setLevel(level: number) {
    switch (level) {
      case 1:
        this.minNumber = 1;
        this.maxNumber = 5;
        this.numQuestions = 7;
        break;
      case 2:
        this.minNumber = 1;
        this.maxNumber = 7;
        this.numQuestions = 7;
        break;
      case 3:
        this.minNumber = 5;
        this.maxNumber = 10;
        this.numQuestions = 10;
        break;
    }
  }

  private generateQuestions() {
    for (let i = 0; i < this.numQuestions; i++) {
      const num1 =
        Math.floor(Math.random() * (this.maxNumber - this.minNumber + 1)) +
        this.minNumber;
      const num2 = Math.floor(Math.random() * 10) + 1;
      this.questions.push({
        question: `${num1} * ${num2} = ?`,
        correctAnswer: num1 * num2,
      });
    }
  }

  public showQuestion() {
    if (this.currentIndex >= this.questions.length) {
      this.showResults();
      return;
    }

    const questionElement = document.getElementById("question")!;
    questionElement.textContent = this.questions[this.currentIndex].question;
  }

  public submitAnswer() {
    const answerInput = document.getElementById("answer") as HTMLInputElement;
    const resultElement = document.getElementById("result")!;

    const userAnswer = parseInt(answerInput.value, 10);
    if (userAnswer === this.questions[this.currentIndex].correctAnswer) {
      this.correctAnswers++;
    } else {
      this.wrongAnswers++;
    }

    this.currentIndex++;
    answerInput.value = ""; // Rensa input-fältet
    if (this.currentIndex < this.questions.length) {
      this.showQuestion();
    } else {
      this.showResults();
    }
  }

  private showResults() {
    const gameDiv = document.getElementById("game")!;
    const resultElement = document.getElementById("result")!;
    resultElement.innerHTML = `
            <h2>Spelet är slut!</h2>
            <p>Antal rätt: ${this.correctAnswers}</p>
            <p>Antal fel: ${this.wrongAnswers}</p>
        `;
  }
}

// Starta spelet när en nivå väljs
let game: MultiplicationGame;

function startGame(level: number) {
  document.getElementById("menu")!.style.display = "none";
  document.getElementById("game")!.style.display = "block";
  game = new MultiplicationGame(level);
}

function submitAnswer() {
  game.submitAnswer();
}
