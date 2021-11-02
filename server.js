const express = require("express");
const app = express();
const port = process.env.port || 8080;

app.use(express.json());

var cors = require("cors");
app.use(cors());

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
});

io.on("connection", (socket) => {
  console.log(`"User Connected: ${socket.id}`);

  socket.on("new-guess", function (data) {
    console.log(data);
    io.emit("new-guess", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
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
//const randomlyChosenWord = Math.floor(Math.random() * availableWords.length);
let randomlyChosenWord = "";
let hiddenCurrentWord = [];
function reInitialize() {
  randomlyChosenWord =
    availableWords[Math.floor(Math.random() * availableWords.length)];
  currentWord = availableWords[randomlyChosenWord];
  currentWord = currentWord.split("");
  hiddenCurrentWord = currentWord.map(
    (index, currentWord) => (currentWord[index] = "_")
  );
}

let currentWord = availableWords[randomlyChosenWord];

// Convert chosen word to character array
let currentWord = availableWords[randomlyChosenWord];
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
});

app.get("/usersData", (req, res) => {
  const hiddenCurrentWordFormatted = hiddenCurrentWord.join(" ");
  const generatedWordFormatted = currentWord.join(" ");
  if (hiddenCurrentWordFormatted == generatedWordFormatted) {
    reInitialize();
  }
  const printedJson = {
    correctGuess: correctGuess,
    generatedWord: generatedWordFormatted,
    displayedWord: hiddenCurrentWordFormatted,
  };

  res.json(printedJson);
});

httpServer.listen(port, () => {
  reInitialize();
});
