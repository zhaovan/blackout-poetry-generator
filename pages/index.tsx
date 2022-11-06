import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRef, useState } from "react";
import parse from "html-react-parser";

const generateRandomNumbers = (max: number, times: number) => {
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
  const [percentage, setPercentage] = useState<number>(0.5);

  const textRef = useRef();

  const [completeBlackoutPoem, setCompleteBlackoutPoem] = useState<string>("");

  function blackoutPoem() {
    console.log(textRef);
    const poem = textRef.current.innerText;
    console.log(poem);
    // text.match(/\n.*\n|\S+/g)
    const words: string[] = poem?.match(/\n.*\n|\S+/g);
    console.log(words);

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
      if (randomNumbers.has(i)) {
        newPoem.push(`<mark>${words[i]}</mark>`);
        // poemString += `<u className={styles.blackoutWord}>${words[i]}</u>`;
      } else {
        newPoem.push(words[i]);
        // poemString += words[i];
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
      <h1>Blackout poetry generator</h1>
      <p contentEditable={true} ref={textRef}>
        in the days of yore how do we know that the men we care about, are
        worthy of deceit
      </p>
      <button onClick={() => blackoutPoem()}>give me a poem!</button>
      <p className={styles.blackoutPoem}>{parse(completeBlackoutPoem)}</p>
    </div>
  );
}
