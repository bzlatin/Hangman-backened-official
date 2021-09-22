const express = require("express");
const app = express();
app.use(express.json());

var cors = require("cors");
const port = process.env.port || 8080;
app.use(cors());

let guess = "";
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/usersGuess/:guess", (req, res) => {
  const p = req.params;
  guess = p.guess;
  res.send(`User has guessed the letter: ${guess}`);
  console.log(guess);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
