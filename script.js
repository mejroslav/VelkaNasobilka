// global constants - mainly HTML Elements
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");

const introContainerElement = document.getElementById("intro-container");
const questionContainerElement = document.getElementById("question-container");

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const answerRemainElement = document.getElementById("answers-remain");
const answerCorrectElement = document.getElementById("answers-correct");
const answerWrongElement = document.getElementById("answers-wrong");

const finalContainerElement = document.getElementById("final-container");
const answerCorrectFinalElement = document.getElementById(
  "answers-correct-final"
);

const STATE = {
  Intro: 0,
  QuestionWaitingForAnswer: 1,
  QuestionAnswered: 2,
  Finished: 3,
};

const questions = generateQuestions(count=10, a_start=10, a_end=20, b_start=10, b_end=20)


let state = STATE.Intro;

let shuffledQuestions;
let currentQuestionIndex;
let numberOfQuestions;
let numberOfRemainingQuestions;
let correctAnsweredQuestions;
let wrongAnsweredQuestions;

// Event Listeners
startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  setNextQuestion();
});

function startGame() {
  console.log("Game started.");
  introContainerElement.classList.add("hide");
  startButton.classList.add("hide");
  questionContainerElement.classList.remove("hide");

  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  numberOfQuestions = shuffledQuestions.length;

  currentQuestionIndex = 0;
  correctAnsweredQuestions = 0;
  wrongAnsweredQuestions = 0;
  numberOfRemainingQuestions = numberOfQuestions - currentQuestionIndex;

  questionContainerElement.classList.remove("hide");
  setNextQuestion();
  displayNumbersOfAnswers();
}

function setNextQuestion() {
  resetState();

  showQuestion(shuffledQuestions[currentQuestionIndex]);
  answerCorrectFinalElement.innerText = "";
}

function setCountOfQuestions(correct = false) {
  currentQuestionIndex++;
  numberOfRemainingQuestions = numberOfQuestions - currentQuestionIndex;
  if (correct) {
    correctAnsweredQuestions++;
  } else {
    wrongAnsweredQuestions++;
  }

  displayNumbersOfAnswers();
}

function displayNumbersOfAnswers() {
  answerRemainElement.innerText = "Zbývá: " + numberOfRemainingQuestions;
  answerCorrectElement.innerText = "Správně: " + correctAnsweredQuestions;
  answerWrongElement.innerText = "Špatně: " + wrongAnsweredQuestions;
}

function selectAnswer(e) {
  if (state !== STATE.QuestionWaitingForAnswer) return;

  state = STATE.QuestionAnswered;
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct;
  setCountOfQuestions(correct);

  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });
  if (numberOfQuestions > currentQuestionIndex) {
    nextButton.classList.remove("hide");
  } else {
    displayFinalResults();
  }
}

function displayFinalResults() {
  finalContainerElement.classList.remove("hide");
  state = STATE.Finished;
  let finalText = "";

  switch (correctAnsweredQuestions) {
    case 0:
      finalText =
        "Ani jednu otázku jsi nezodpověděl správně! Hybaj zpátky do školy, pacholku!";
      break;
    case 1:
      finalText =
        "Pouze jednu otázku jsi zodpověděl správně! Měl bys uvažovat o návratu do školy!";
      break;
    default:
      finalText =
        "Povedlo se ti správně zodpovědět " +
        correctAnsweredQuestions +
        " otázek!";
  }

  answerCorrectFinalElement.innerText = finalText;
  startButton.innerText = "Hrát znovu";
  startButton.classList.remove("hide");
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function showQuestion(question) {
  state = STATE.QuestionWaitingForAnswer;
  questionElement.innerText = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn", "question-btn");

    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer); // TODO: zatím lze na tlačítka klikat neomezeně, někam přidat removeEventListener?

    answerButtonsElement.appendChild(button);
  });
}


function generateQuestions(count, a_start, a_end, b_start, b_end) {
  const questions = [];

  for(let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * (a_end - a_start + 1)) + a_start;
    const b = Math.floor(Math.random() * (b_end - b_start + 1)) + b_start;
    const correctAnswer = a * b;
    
    // const answers = [
    //   { text: correctAnswer, correct: true },
    //   { text: correctAnswer + Math.floor(Math.random()*10), correct: false },
    //   { text: correctAnswer + Math.floor(Math.random()*10), correct: false },
    //   { text: correctAnswer + Math.floor(Math.random()*10), correct: false }
    // ];
    
    const answers = getAnswers(correctAnswer);

    // Shuffle the answers
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    questions.push({
      question: `Kolik je ${a} x ${b}?`,
      answers: answers
    });
  }

  return questions;
}

function getAnswers(correctAnswer){
  const answers = [ {"text" : correctAnswer, "correct": true }]
  for (let i = 0; i<3; i++){
    while(true) {
      const randomAnswer = Math.floor(Math.random() * 10) + correctAnswer
      if (
        answers.includes({"text": randomAnswer, "correct": true}) 
      || answers.includes({"text": randomAnswer, "correct": false}) 
      ) continue;
      answers.push({
        "text": randomAnswer,
        "correct": false
      })
      break;
    }

  }
  return answers
}