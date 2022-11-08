import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRef, useState } from "react";
import parse from "html-react-parser";

import posTagger from "wink-pos-tagger";

const generateRandomNumbers = (max, times) => {
  const randoms = new Set();
  let num;
  while (randoms.size !== times) {
    num = Math.floor(Math.random() * max);
    if (!randoms.has(num)) {
      randoms.add(num);
    }
  }

  return randoms;
};

// Currently supports randomly generated

// want to make a smarter version, that is based on monte carlo of choosing words ?????
//  i.e. if this word is a noun, the next blacked out word must be a verb /
// ?? is it possible for this to happen? I think will
// not be based off frequencies, instead jsut chooses randomly

export default function Home() {
  const [percentage, setPercentage] = useState(0.5);

  const textRef = useRef();

  const [completeBlackoutPoem, setCompleteBlackoutPoem] = useState("");

  function blackoutPoem() {
    const poem = textRef.current.innerText;

    // regex to match strings including new line breaks, used as opposed to builtin split
    // function
    const words = poem?.match(/\n.*\n|\S+/g);

    if (words?.length === 0) {
      return;
    }

    // subtract 1 here to correspond to index
    const randomNumbers = generateRandomNumbers(
      words?.length - 1,
      Math.floor(percentage * words?.length)
    );
    // let poemString = "<p>";
    const newPoem = [];
    for (let i = 0; i < words?.length; i++) {
      if (!randomNumbers.has(i)) {
        newPoem.push(`<mark>${words[i]}</mark>`);
        // poemString += `<u className={styles.blackoutWord}>${words[i]}</u>`;
      } else {
        newPoem.push(words[i]);
        // poemString += words[i];
      }
    }

    setCompleteBlackoutPoem(newPoem.join(" "));
  }

  function markovBlackoutPoem() {
    const poem = textRef.current.innerText;

    // regex to match strings including new line breaks, used as opposed to builtin split
    // function

    const tagger = posTagger();
    const taggedWords = tagger.tagSentence(poem);
    console.log(taggedWords);
    const newPoem = [];

    let firstWordChosen = false;

    let currPartOfSpeech;

    for (let tag of taggedWords) {
      const chooseWord = Math.random();

      // if first word hasn't been chosen yet
      if (!firstWordChosen) {
        if (chooseWord < percentage) {
          newPoem.push(tag.value);
          currPartOfSpeech = newPoem.push(tag.pos);
          firstWordChosen = true;
        } else {
          newPoem.push(`<mark>${tag.value}</mark>`);
        }
      } else {
        // first word has been chosen
        // get the probability distribution / state space onto next possible words
        // see if the current word maps to it, if so, choose with probability in the space
        // if not, push a blacked out word
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Blackout Poetry Generator</title>
        <meta
          name="description"
          content="Make your own blackout poems with this nifty tool"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Blackout poetry generator</h1>

      {/* TODO: Change the default so that it randomly selects from a vairety of poems */}
      <p contentEditable={true} ref={textRef}>
        in the days of yore how do we know that the men we care about, are
        worthy of deceit
      </p>
      <button onClick={() => blackoutPoem()}>give me a poem!</button>
      <button onClick={() => markovBlackoutPoem()}>
        give me a "smart" poem
      </button>
      <p className={styles.blackoutPoem}>{parse(completeBlackoutPoem)}</p>
    </div>
  );
}
