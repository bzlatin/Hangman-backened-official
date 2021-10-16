const express = require("express");
const app = express();

app.use(express.json());

var cors = require("cors");
app.use(cors());

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

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

app.get("/usersGuess/:guess", (req, res) => {
  const p = req.params;
  guess = p.guess;

  const correctGuessHandler = function () {
    correctGuess = true;

    for (let i = 0; i < hiddenCurrentWord.length; i++) {
      let pos = currentWord.indexOf(guess, i);
      if (pos !== -1) hiddenCurrentWord[pos] = guess;
    }
  };

  if (currentWord.includes(guess)) {
    console.log("You guessed a correct letter");
    correctGuessHandler();
    console.log(hiddenCurrentWord);
  } else {
    console.log("You guessed the wrong letter. Try again");
    correctGuess = false;
  }

  const hiddenCurrentWordFormatted = hiddenCurrentWord.join(" ");
  const generatedWordFormatted = currentWord.join(" ");

  const printedJson = {
    correctGuess: correctGuess,
    generatedWord: generatedWordFormatted, // just for testing for now
    displayedWord: hiddenCurrentWordFormatted,
  };

  res.json(printedJson);
});

httpServer.listen(8080);
httpServer.listen(8081);
