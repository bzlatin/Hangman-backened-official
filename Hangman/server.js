const express = require("express");
const app = express();
const port = 3000;

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

app.get("/", (req, res) => {
  // Randomly select a word from the availableWords array
  const randomlyChosenWord = Math.floor(Math.random() * availableWords.length);

  let currentWord = randomlyChosenWord;
  res.send(availableWords[currentWord]);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
