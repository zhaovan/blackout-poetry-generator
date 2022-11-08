# Blackout Poetry Generator

This work was inspired by [this project](https://mkremins.github.io/blackout/) which black outs entire web pages. Specifically, I want to do two things to work on this

1. The first is to have it randomly generate a poem based on parameters passed by the user. Currently it's set at 50% because I literally did this in two hours and need a nap

2. The second is to use some kind of markov chain of probabilities to choose the next word. This will probably be done with some classification model on type of word. This part is not yet implemented because I am going to sleep but I'm writing down thoughts for future ivan to work on

<!-- Important docs -->

11/7/22 Updates
As of now, markov process seems logical, going to get corpus from [Professor Parish](https://www.decontextualize.com/) which will be run on to get the weights of a markov model to be used in creating our poetry blackout generator. will it work?? who knows. more notes in comments, but plan on running this through a parts of speech text tagger and then creating a probability distribution of weights

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
