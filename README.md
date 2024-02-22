# emoji-game

free game avaliable @ [emoji.theohaines.xyz](https://emoji.theohaines.xyz/)!

## Adding new questions
If you'd like you can open a pull request and add some new questions to the site!

### Json file structure
hint: You can find the `questions.json` file here `/src/questions.json`
an average question will look like this: 

        {
            "type" : "multi",
            "question" : "What emoji is this?",
            "emojis" : "🧳",
            "answers" : [
                {
                    "answerA" : "breifcase",
                    "answerB" : "luggage",
                    "answerC" : "suitcase"
                }
            ],
            "answer" : "b"
        }

### Question parameters

All questions have the following parameters:

- type (used to tell the front end how to render the "answer box")
- question (the actual question e.g what emoji is this?)
- emojis (you can use this to display the emoji you're asking a question about)
- answers (these are the diffirent answers the player can give (not used with text questions))
- answer (the correct answer to the question)

#### multi questions

multi questions should follow this format:

        {
            "type" : "multi",
            "question" : "What emoji is this?",
            "emojis" : "🧳",
            "answers" : [
                {
                    "answerA" : "breifcase",
                    "answerB" : "luggage",
                    "answerC" : "suitcase"
                }
            ],
            "answer" : "b"
        }

this will render the question like this:

![image](https://github.com/Theohaines/emoji-game/assets/91698052/a066760c-4891-4584-81eb-c8470e630091)

#### text questions

text questions should follow this format:

        {
            "type" : "text",
            "question" : "What popular saying is this?",
            "emojis" : "❓ 🔪 🐈",
            "answers" : [
                {
                    "answerA" : "",
                    "answerB" : "",
                    "answerC" : ""
                }
            ],
            "answer" : "curiosity killed the cat"
        }

this will render the question like this:

![image](https://github.com/Theohaines/emoji-game/assets/91698052/092fc0aa-eb88-492f-aab8-42d63418f6af)

#### radio questions

radio questions should follow this format:

        {
            "type" : "radio",
            "question" : "Select emojis that released in 2018",
            "emojis" : "🚹 🧹 😀 💅 🧶",
            "answers" : [
                {
                    "answerA" : "🚹",
                    "answerB" : "🧹",
                    "answerC" : "😀",
                    "answerD" : "💅",
                    "answerE" : "🧶"
                }
            ],
            "answer" : ["b", "e"]
        }

this will render the question like this:

![image](https://github.com/Theohaines/emoji-game/assets/91698052/0b63bb92-0257-4096-beee-864a3584b4c7)

## What if I want to add something else?

I'd love that! be warned the code is kind of a mess at the moment and to be honest will most likely stay that way.
If you do want to brave the depths of my messy code and add something cool though be my guest! If you want to make
your own fork and do whatever crazy stuff you wanna do to it I just ask you credit me!

## Credits and donations

If you really love the project and want to support me you can donate @ [ko-fi.com](https://ko-fi.com/theohaines)!



