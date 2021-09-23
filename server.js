const express = require("express");
const app = express();
app.use(express.json());

var cors = require("cors");
const port = process.env.port || 8080;
app.use(cors());

let guess = "";
let correctGuess = false;

const availableWords = [
  "poopy",
  "africa",
  "pokemon",
  "gonorrhea",
  "watermelon",
  "hyperbola",
  "shark",
  "fingernail",
  "wallpaper",
  "mousepad",
  "erect",
];

// Randomly select a word from the availableWords array
const randomlyChosenWord = Math.floor(Math.random() * availableWords.length);

let currentWord = availableWords[randomlyChosenWord];

// Convert chosen word to character array
currentWord = currentWord.split("");
console.log(currentWord);

// Replace currentWord array with "_" for each item in array
let hiddenCurrentWord = currentWord.map(
  (index, currentWord) => (currentWord[index] = "_")
);

const correctGuessHandler = function () {
  correctGuess = true;
  let pos = currentWord.indexOf(guess);
  // If the letter appears more than once:
  let pos2 = currentWord.indexOf(guess, 2);
  let pos3 = currentWord.indexOf(guess, 3);
  let pos4 = currentWord.indexOf(guess, 4);
  let pos5 = currentWord.indexOf(guess, 5);
  let pos6 = currentWord.indexOf(guess, 6);
  let pos7 = currentWord.indexOf(guess, 7);
  let pos8 = currentWord.indexOf(guess, 8);

  // Add guess to pos but in hiddenCurrentWord
  if (pos !== -1) {
    hiddenCurrentWord[pos] = guess;
  }
  if (pos2 !== -1) {
    hiddenCurrentWord[pos2] = guess;
  }
  if (pos3 !== -1) {
    hiddenCurrentWord[pos3] = guess;
  }
  if (pos4 !== -1) {
    hiddenCurrentWord[pos4] = guess;
  }
  if (pos5 !== -1) {
    hiddenCurrentWord[pos5] = guess;
  }
  if (pos6 !== -1) {
    hiddenCurrentWord[pos6] = guess;
  }
  if (pos7 !== -1) {
    hiddenCurrentWord[pos7] = guess;
  }
  if (pos8 !== -1) {
    hiddenCurrentWord[pos8] = guess;
  }
};

app.get("/usersGuess/:guess", (req, res) => {
  const p = req.params;
  guess = p.guess;

  if (currentWord.includes(guess)) {
    console.log("You guessed a correct letter");
    correctGuessHandler();
    console.log(hiddenCurrentWord);
  } else {
    console.log("You guessed the wrong letter. Try again");
    correctGuess = false;
  }

  const printedJson = {
    correctGuess: correctGuess,
    currentWord: hiddenCurrentWord,
  };

  res.send(printedJson);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
