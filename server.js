const express = require("express");
const app = express();

app.use(express.json());

var cors = require("cors");
app.use(cors());

const { createServer } = require("http");
const { Server } = require("socket.io");
const { count } = require("console");
const httpServer = createServer(app);

const port = process.env.port || 8080;

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
    // io.emit("new-guess", data);
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

//This is the random word from the array that is to be guessed
let currentWord = "";

//How far you have guessed
let hiddenCurrentWord = [];

function reInitialize() {
  currentWord =
    availableWords[Math.floor(Math.random() * availableWords.length)];
  currentWord = currentWord.split("");
  hiddenCurrentWord = currentWord.map(() => "_");
  console.log(currentWord);
}

let counter = 0;

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
  } else if (!currentWord.includes(guess) && counter < 8) {
    counter++;
    console.log(counter);
    console.log("You guessed the wrong letter. Try again");
    correctGuess = false;
  } else {
    reInitialize();
  }
  io.emit("new-guess");

  res.send("done.");
});

app.get("/usersData", (req, res) => {
  const hiddenCurrentWordFormatted = hiddenCurrentWord.join(" ");
  const generatedWordFormatted = currentWord.join(" ");

  const printedJson = {
    correctGuess: correctGuess,
    generatedWord: generatedWordFormatted,
    displayedWord: hiddenCurrentWordFormatted,
  };

  res.json(printedJson);
});

app.get("/usersData/newGame", (req, res) => {
  reInitialize();
  res.send("New Game");
});

httpServer.listen(port, () => {
  reInitialize();
});
