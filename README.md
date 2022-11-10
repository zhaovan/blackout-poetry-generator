# Blackout Poetry Generator

This work was inspired by [this project](https://mkremins.github.io/blackout/) which black outs entire web pages. Specifically, I want to do two things to work on this

1. The first is to have it randomly generate a poem naively.
2. The second is to uses a trained markov chain on parts of speech to "more intuitively" figure out if a word should be used or not.

## Implementation

If you're curious about the implementation, it uses a corpus taken from [Professor Parrish's work](https://github.com/aparrish/gutenberg-poetry-corpus) which is three million lines of poem. Each line is tagged by a parts of speech tagger (that I graciously used from the OS community because writing that seems outside my wheelhouse) and then creates a transition matrix (basic idea of a [Markov model](https://en.wikipedia.org/wiki/Markov_model)) to determine all possible words that could follow. From there, it's saved as a JSON which is then used on the frontend to determine if a word should be included! Not too bad and not too shabby for something that's not GPT3 lol.

Code for this can be found in `scripts/getWeights.js`

<!-- Important docs -->

## Updates to myself... you can read this if you want

11/7/22 Updates
As of now, markov process seems logical, going to get corpus from [Professor Parrish](https://www.decontextualize.com/) which will be run on to get the weights of a markov model to be used in creating our poetry blackout generator. will it work?? who knows. more notes in comments, but plan on running this through a parts of speech text tagger and then creating a probability distribution of weights

## Annotation Specification

| Annotation | Name                      | Example                                   |
| ---------- | ------------------------- | ----------------------------------------- |
| **`NN`**   | Noun                      | `dog` `man`                               |
| **`NNS`**  | Plural noun               | `dogs` `men`                              |
| **`NNP`**  | Proper noun               | `London` `Alex`                           |
| **`NNPS`** | Plural proper noun        | `Smiths`                                  |
| **`VB`**   | Base form verb            | `be`                                      |
| **`VBP`**  | Present form verb         | `throw`                                   |
| **`VBZ`**  | Present form (3rd person) | `throws`                                  |
| **`VBG`**  | Gerund form verb          | `throwing`                                |
| **`VBD`**  | Past tense verb           | `threw`                                   |
| **`VBN`**  | Past participle verb      | `thrown`                                  |
| **`MD`**   | Modal verb                | `can` `shall` `will` `may` `must` `ought` |
| **`JJ`**   | Adjective                 | `big` `fast`                              |
| **`JJR`**  | Comparative adjective     | `bigger`                                  |
| **`JJS`**  | Superlative adjective     | `biggest`                                 |
| **`RB`**   | Adverb                    | `not` `quickly` `closely`                 |
| **`RBR`**  | Comparative adverb        | `less-closely` `faster`                   |
| **`RBS`**  | Superlative adverb        | `fastest`                                 |
| **`DT`**   | Determiner                | `the` `a` `some` `both`                   |
| **`PDT`**  | Predeterminer             | `all` `quite`                             |
| **`PRP`**  | Personal Pronoun          | `I` `you` `he` `she`                      |
| **`PRP$`** | Possessive Pronoun        | `I` `you` `he` `she`                      |
| **`POS`**  | Possessive ending         | `'s`                                      |
| **`IN`**   | Preposition               | `of` `by` `in`                            |
| **`PR`**   | Particle                  | `up` `off`                                |
| **`TO`**   | _to_                      | `to`                                      |
| **`WDT`**  | Wh-determiner             | `which` `that` `whatever` `whichever`     |
| **`WP`**   | Wh-pronoun                | `who` `whoever` `whom` `what`             |
| **`WP$`**  | Wh-possessive             | `whose`                                   |
| **`WRB`**  | Wh-adverb                 | `how` `where`                             |
| **`EX`**   | Expletive there           | `there`                                   |
| **`CC`**   | Coordinating conjugation  | `&` `and` `nor` `or`                      |
| **`CD`**   | Cardinal Numbers          | `1` `7` `77` `one`                        |
| **`LS`**   | List item marker          | `1` `B` `C` `One`                         |
| **`UH`**   | Interjection              | `ah` `oh` `oops`                          |
| **`FW`**   | Foreign Words             | `viva` `mon` `toujours`                   |
| **`,`**    | Comma                     | `,`                                       |
| **`:`**    | Mid-sent punct            | `:` `;` `...`                             |
| **`.`**    | Sent-final punct.         | `.` `!` `?`                               |
| **`(`**    | Left parenthesis          | `)` `}` `]`                               |
| **`)`**    | Right parenthesis         | `(` `{` `[`                               |
| **`#`**    | Pound sign                | `#`                                       |
| **`$`**    | Currency symbols          | `$` `€` `£` `¥`                           |
| **`SYM`**  | Other symbols             | `+` `*` `/` `<` `>`                       |
| **`EM`**   | Emojis & emoticons        | `:)` `❤`                                  |
