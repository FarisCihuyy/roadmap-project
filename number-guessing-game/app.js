import { select, input } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const topScoreFile = path.join(__dirname, "top-scores.json");

if (!fs.existsSync(topScoreFile)) {
  fs.writeFileSync(
    topScoreFile,
    JSON.stringify({
      difficulty: {
        easy: 10,
        medium: 5,
        hard: 3,
      },
    })
  );
}

const topScore = JSON.parse(fs.readFileSync(topScoreFile, "utf-8"));
const saveScore = () => {
  fs.writeFileSync(topScoreFile, JSON.stringify(topScore, null, 2));
};

const startGame = async () => {
  console.log(
    chalk.blue.bold(
      "Welcome to the Number Guessing Game! \nI'm thinking of a number between 1 and 100.\n"
    )
  );

  const difficulty = await select({
    message: "Please select the difficulty level:",
    choices: [
      {
        name: "1. Easy (10 chances)",
        value: { name: "easy", chances: 10 },
      },
      {
        name: "2. Medium (5 chances)",
        value: { name: "medium", chances: 5 },
      },
      {
        name: "3. Hard (3 chances)",
        value: { name: "hard", chances: 3 },
      },
    ],
  });

  console.log("Let's start the game!");
  let hintLevel = 0;
  const startAt = Date.now();
  const { name, chances } = difficulty;
  const randomInt = getRandomInt(1, 100);

  let answer = false;
  for (let i = 1; i <= chances; i++) {
    const guess = await input({
      message: "Enter your guess (type 'help' for hints):",
      validate: (value) => {
        if (value.toLowerCase() === "help") {
          return true;
        }

        if (isNaN(value) || value < 1 || value > 100) {
          return "Please enter a valid number between 1 and 100";
        }

        return true;
      },
    });

    if (guess === "help") {
      i--;
      if (hintLevel < 3) {
        hintLevel++;
        showHint(hintLevel, randomInt);
        continue;
      }

      console.log(chalk.red("No more hints available."));
    } else if (parseInt(guess) < randomInt) {
      console.log(
        chalk.yellow(`Incorrect! The number is greater than ${guess}.`)
      );
    } else if (parseInt(guess) > randomInt) {
      console.log(chalk.yellow(`Incorrect! The number is less than ${guess}.`));
    } else {
      const finishAt = Date.now();
      const timeTaken = Math.round((finishAt - startAt) / 1000);
      const message =
        timeTaken > 60
          ? `Time taken: ${Math.floor(timeTaken / 60)} minutes ${
              timeTaken % 60
            } seconds`
          : `Time taken: ${timeTaken} seconds`;
      answer = true;
      console.log(
        chalk.green.bold(
          `Congratulations! You guessed the correct number in ${i} attempts.`
        )
      );

      console.log(message);
      if (i < topScore.difficulty[name]) {
        topScore.difficulty[name] = i;
        saveScore();
        console.log(chalk.green("New top score!"));
      }
      break;
    }
  }

  if (!answer) {
    console.log(
      chalk.red(
        `Sorry, you ran out of chances. The correct number was ${randomInt}.`
      )
    );
  }

  const playAgain = await select({
    message: "Do you want to play again?",
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false },
    ],
  });

  if (playAgain) {
    return startGame();
  }
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function showHint(hintLevel, secret) {
  const ranges = [
    { min: 1, max: 100 },
    { min: secret - 20, max: secret + 20 },
    { min: secret - 10, max: secret + 10 },
  ];

  const r = ranges[Math.min(hintLevel, ranges.length - 1)];

  console.log(
    chalk.yellow(
      `Hint: The number is between ${Math.max(1, r.min)} and ${Math.min(
        100,
        r.max
      )}`
    )
  );
}

startGame();
