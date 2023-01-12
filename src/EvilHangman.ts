import input from "@inquirer/input";
import chalk from "chalk";
import { setTimeout } from "timers/promises";

interface PotentialOutcomes {
  position0: string[];
  position1: string[];
  position2: string[];
  position3: string[];
  none: string[];
}

const WORDS = [
  "tell",
  "mind",
  "test",
  "cafe",
  "hero",
  "find",
  "read",
  "beat",
  "seed",
  "feed"
];

const _word = "____";
const wordLength = _word.length;

export default class EvilHangman {
  private static remaining = 5;

  private static word = _word;

  private static words = WORDS;

  public static async start(turnsRemaining = 5) {
    EvilHangman.remaining = turnsRemaining;
    while (EvilHangman.remaining && EvilHangman.word.includes("_")) {
      console.clear();
      await setTimeout(50);
      console.log("*** Evil Hangman ***");
      console.log(`\n${chalk.bold("Hangman")}: What's the the ${wordLength}-letter word!?`);
      console.log(`\nWORD: ${EvilHangman.word} (Chances Remaining: ${EvilHangman.remaining})\n`);

      const letter = await input({
        message: "Guess letter:",
      });

      // await EvilHangman.debug("before");

      await EvilHangman.updateWords(letter);
      await EvilHangman.updateWord(letter);

      // await EvilHangman.debug("after");

      EvilHangman.remaining -= 1;
    }

    EvilHangman.end();
  }

  private static async updateWords(letter: string) {
    const potentialOutcomes: PotentialOutcomes = {
      position0: [],
      position1: [],
      position2: [],
      position3: [],
      none: [],
    };

    // populate potential outcomes
    const wordsRemaining = [...EvilHangman.words];
    wordsRemaining.forEach((word, wordIndex) => {
      word.split("").forEach((char, charIndex) => {
        if (char === letter) {
          // todo: handle repeated letter case separately?
          potentialOutcomes[`position${charIndex}` as keyof PotentialOutcomes]
            .push(wordsRemaining.splice(wordIndex, 1)[0]);
        } else {
          potentialOutcomes.none = wordsRemaining;
        }
      });
    });

    [EvilHangman.words] = Object.values(potentialOutcomes).sort((a, b) => b.length - a.length);
  }

  private static async updateWord(letter: string) {
    const positionFlags = EvilHangman.words
      .map((word) => word.split(""))
      .map((chars) => chars.map((char) => char === letter))
      .reduce((prevFlag, currFlag) => ([
        prevFlag[0] && currFlag[0],
        prevFlag[1] && currFlag[1],
        prevFlag[2] && currFlag[2],
        prevFlag[3] && currFlag[3]
      ]));

    EvilHangman.word = positionFlags
      .map((flag, i) => (flag ? letter : EvilHangman.word[i])).join("");

    const guessedRight = positionFlags.some((flag) => flag);
    process.stdout.write(
      `\n${chalk.bold("Hangman")}: ${guessedRight ? chalk.green("Okay") : chalk.red("Wrong!")}  `
    );
    await input({ message: "Press <Enter> to continue..." });
  }

  private static async debug(label = "") {
    console.debug(chalk.gray(`\n*** ${label.toUpperCase()} ***`));
    console.debug(chalk.gray(`GUESS: ${EvilHangman.word}`));
    console.debug(chalk.gray(`WORDS: ${EvilHangman.words}\n`));
    await input({ message: "Press <Enter> to continue..." });
  }

  private static end() {
    console.log();
    console.log(`   GUESS: ${EvilHangman.word}`);
    console.log(`SOLUTION: ${EvilHangman.words[0]}`);

    if (EvilHangman.word.includes("_")) {
      console.log("\nGAME OVER: You hanged! 💀");
    } else {
      console.log("\nCONGRATULATIONS: You survived! 🎉");
    }
  }
}
