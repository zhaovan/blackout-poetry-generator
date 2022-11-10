/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { useRef, useState } from "react";
import parse from "html-react-parser";
import posTagger from "wink-pos-tagger";
import Slider from "rc-slider";

// CSS Imports
import styles from "../styles/Home.module.css";
import "rc-slider/assets/index.css";

// Components
import TextInput from "../components/TextInput";

// functions
import generateRandomNumbers from "../helpers/generateRandomNumbers";

// weights used for model
import weights from "../scripts/data/weights.json";
import countWeights from "../scripts/data/weights-count.json";

// Currently supports randomly generated

// want to make a smarter version, that is based on monte carlo of choosing words ?????
//  i.e. if this word is a noun, the next blacked out word must be a verb /
// ?? is it possible for this to happen? I think will
// not be based off frequencies, instead jsut chooses randomly

export default function Home() {
  const [percentage, setPercentage] = useState(0.5);
  const [completeBlackoutPoem, setCompleteBlackoutPoem] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState(false);
  const [startingWord, setStartingWord] = useState("");
  const textRef = useRef();

  function blackoutPoem() {
    const poem = textRef.current.innerHTML;

    // regex to match strings including new line breaks, used as opposed to builtin split
    // function
    const words = poem?.match(/\n.*\n|\S+|/g).filter((word) => word !== "");

    if (poem.length === 0 || words?.length === 0) {
      setCompleteBlackoutPoem("");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
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

      // finds all the POS in the poem
      const posInPoem = new Set();
      for (const word of taggedWords) {
        posInPoem.add(word.pos);
      }

      let currPartOfSpeech = null;

      for (let tag of taggedWords) {
        const chooseWord = Math.random();

        // if first word hasn't been chosen yet
        if (currPartOfSpeech === null) {
          if (tag.value.toLowerCase() === startingWord.toLowerCase()) {
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
          const currTransitionMatrix = { ...countWeights[currPartOfSpeech] };

          let totalCount = 0;
          for (const pos of posInPoem) {
            totalCount += currTransitionMatrix[pos];
          }
          for (const pos of posInPoem) {
            currTransitionMatrix[pos] /= totalCount;
          }

          if (
            tag.pos in currTransitionMatrix &&
            chooseWord < currTransitionMatrix[tag.pos]
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
        <link rel="icon" href="/poemlogo.png" />
        <meta property="og:image" content="/og-img.png" />
        <meta property="og:title" content="Blackout Poetry Generator" />

        <meta
          property="og:description"
          content="Make your own blackout poems with this nifty tool"
        />

        <meta property="og:image:width" content="1200" />

        <meta property="og:image:height" content="600" />
        <meta name="twitter:card" content="summar_large_image" />
      </Head>

      <h1>Blackout Poetry Generator</h1>
      <p>
        Welcome friend! Ever wanted to make blackout poetry? Well now you can!
        Drop your poem in the text box below, hit generate, and see what you
        get! Here's some examples to get you going, but nothing's better than
        something that comes from your brain.
      </p>

      <TextInput textRef={textRef} error={error} />

      <div
        onChange={(e) => setType(e.target.value)}
        className={styles.buttonContainer}
      >
        <label>
          <input type="radio" name="type" value="random" />
          Random
        </label>

        <label>
          <input type="radio" name="type" value="markov" />
          Smart
        </label>
        <details className={styles.info}>
          <summary>what does "smart" mean</summary>
          <p className={styles.infoText}>
            I'm so glad you asked old chap! Your poem is tagged with parts of
            speech classifier. From there, each word is treated as a possible
            state space for a Markov model trained on three million lines of
            poetry. For more info, go check out the{" "}
            <a
              href="https://github.com/zhaovan/blackout-poetry-generator"
              target="_blank"
              rel="noreferrer"
            >
              README
            </a>{" "}
            on the github page!
          </p>
        </details>
      </div>
      {type !== "" && (
        <>
          {type === "random" ? (
            <>
              <p>Set the percentage of poem to keep</p>
              <div className={styles.sliderContainer}>
                <Slider
                  tipProps
                  defaultValue={percentage * 100}
                  onChange={(val) => {
                    setPercentage(val / 100);
                  }}
                  handleRender={(renderProps) => {
                    return (
                      <div {...renderProps.props}>
                        <div className={styles.tooltip}>
                          {Math.round(percentage * 100)}%
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </>
          ) : (
            <div>
              <p>Choose your starting word</p>
              <input
                type="text"
                onChange={(e) => setStartingWord(e.target.value)}
                className={styles.startingWordTextbox}
              ></input>
            </div>
          )}

          <button onClick={() => blackoutPoem()} className={styles.button}>
            Generate
          </button>
        </>
      )}

      {completeBlackoutPoem && (
        <p className={styles.blackoutPoem}>{parse(completeBlackoutPoem)}</p>
      )}
      <footer>
        This is a small project created by{" "}
        <a href="https://ivanzhao.me" target={"_blank"} rel="noreferrer">
          ivan
        </a>{" "}
        in his interest of building tools for creativity.
      </footer>
    </div>
  );
}
