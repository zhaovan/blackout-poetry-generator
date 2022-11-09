import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRef, useState } from "react";
import TextInput from "./TextInput";
import parse from "html-react-parser";
import weights from "../scripts/data/weights.json";
import posTagger from "wink-pos-tagger";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import generateRandomNumbers from "../helpers/generateRandomNumbers";

// Currently supports randomly generated

// want to make a smarter version, that is based on monte carlo of choosing words ?????
//  i.e. if this word is a noun, the next blacked out word must be a verb /
// ?? is it possible for this to happen? I think will
// not be based off frequencies, instead jsut chooses randomly

export default function Home() {
  const [percentage, setPercentage] = useState(0.5);

  const textRef = useRef();

  const [completeBlackoutPoem, setCompleteBlackoutPoem] = useState("");

  function blackoutPoem(type) {
    const poem = textRef.current.innerText;

    if (poem.length === 0) {
      return;
    }

    // regex to match strings including new line breaks, used as opposed to builtin split
    // function
    const words = poem?.match(/\n.*\n|\S+/g);

    if (words?.length === 0) {
      return;
    }

    const newPoem = [];

    if (type === "random") {
      if (percentage === 1) {
        setCompleteBlackoutPoem(poem);
        return;
      }
      // subtract 1 here to correspond to index
      const randomNumbers = generateRandomNumbers(
        words?.length - 1,
        Math.floor(percentage * words?.length)
      );

      for (let i = 0; i < words?.length; i++) {
        if (!randomNumbers.has(i)) {
          newPoem.push(`<mark>${words[i]}</mark>`);
        } else {
          newPoem.push(words[i]);
        }
      }
    } else if (type === "markov") {
      const tagger = posTagger();
      const taggedWords = tagger.tagRawTokens(words);

      let currPartOfSpeech = null;

      for (let tag of taggedWords) {
        const chooseWord = Math.random();

        // if first word hasn't been chosen yet
        if (currPartOfSpeech === null) {
          if (chooseWord < percentage) {
            newPoem.push(tag.value);
            currPartOfSpeech = tag.pos;
          } else {
            newPoem.push(`<mark>${tag.value}</mark>`);
          }
        } else {
          // first word has been chosen
          // get the probability distribution / state space onto next possible words
          // see if the current word maps to it, if so, choose with probability in the space
          // if not, push a blacked out word

          if (
            tag.pos in weights[currPartOfSpeech] &&
            chooseWord < weights[currPartOfSpeech][tag.pos]
          ) {
            // word has been chosen
            newPoem.push(tag.value);
            currPartOfSpeech = tag.pos;
          } else {
            newPoem.push(`<mark>${tag.value}</mark>`);
          }
        }
      }
    }

    setCompleteBlackoutPoem(newPoem.join(" "));
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

      <h1>Blackout Poetry Generator</h1>
      <p>
        Welcome friend! Ever wanted to make blackout poetry? Well now you can,
        with terrible randomness! This is a small project created by{" "}
        <a href="https://ivanzhao.me" target={"_blank"} rel="noreferrer">
          corgo
        </a>{" "}
        in his interest of building tools and computational poetry. Drop your
        poem in the text box below, hit generate, and see what you get!
      </p>
      {/* TODO: Change the default so that it randomly selects from a vairety of poems */}
      <TextInput textRef={textRef} />
      <div className={styles.sliderContainer}>
        <Slider
          tipProps
          defaultValue={percentage * 100}
          step={10}
          onChange={(val) => {
            setPercentage(val / 100);
            blackoutPoem("random");
          }}
          handleRender={(renderProps) => {
            return (
              <div {...renderProps.props}>
                <div>{Math.round(percentage * 100)}%</div>
              </div>
            );
          }}
        />
      </div>

      <button onClick={() => blackoutPoem("random")}>
        randomly generate a blackout poem
      </button>
      <button onClick={() => blackoutPoem("markov")}>
        smartly generate a blackout poem
      </button>
      <p className={styles.blackoutPoem}>{parse(completeBlackoutPoem)}</p>
    </div>
  );
}
