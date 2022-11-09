const ndjson = require("ndjson");
const fs = require("fs");

const postTagger = require("wink-pos-tagger");

const weights = {};
let lastGID = 0;
let prevWordPOS = null;

function getWeights(filePath) {
  const tagger = postTagger();
  fs.createReadStream(filePath)
    .pipe(ndjson.parse())
    .on("data", function (obj) {
      if (lastGID != obj.gid) {
        console.log("current gid" + obj.gid);
        lastGID = obj.gid;
        prevWordPOS = null;
      }
      const taggedLine = tagger.tagSentence(obj.s);

      for (let word of taggedLine) {
        const currWordPOS = word.pos;
        if (prevWordPOS !== null) {
          // check if we have the next word type in the transition matrix
          if (prevWordPOS in weights) {
            const transitionMatrix = weights[prevWordPOS];
            if (currWordPOS in transitionMatrix) {
              transitionMatrix[currWordPOS] += 1;
              // sets the count to one
            } else {
              transitionMatrix[currWordPOS] = 1;
            }
          } else {
            weights[prevWordPOS] = new Object();
            weights[prevWordPOS][currWordPOS] = 1;
          }
          //   totalWords += 1;
          prevWordPOS = currWordPOS;

          // sets the first word of poem
        } else {
          prevWordPOS = currWordPOS;
        }
      }
    })
    .on("end", () => {
      console.log(weights);
      for (const [pos, transitionMatrix] of Object.entries(weights)) {
        const totalWords = Object.values(transitionMatrix).reduce(
          (partialSum, a) => partialSum + a,
          0
        );
        for (const key of Object.keys(transitionMatrix)) {
          transitionMatrix[key] /= totalWords;
        }
      }
      fs.writeFileSync("./data/weights.json", JSON.stringify(weights));
      console.log(weights);
    });
}

getWeights("./data/corpus.ndjson");
// getWeights("./data/small-corpus.ndjson");
// Now that we have the weights, we want to calculate probability distributions in each case

// console.log(weights);
