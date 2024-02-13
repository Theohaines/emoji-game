const express = require("express");
const dotenv = require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const questions = require('./questions.json');
const { debug } = require("console");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use("/", express.static("src/public"));

app.get("/", async (req, res) => {

    res.sendFile(path.resolve("src/public/homepage/index.html"));

});

app.use('/getquestion', (req, res) => {
    var questionJSON = questions.questions[Math.floor(Math.random() * questions.questions.length)];

    var id = questionJSON.id;
    var question  = questionJSON.question;
    var emojis = questionJSON.emojis;
    var answers = questionJSON.answers;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({id, question, emojis, answers}));
});

app.use('/submitanswer', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
    if (!validateAnswer(req)){
		res.send(JSON.stringify({"response" : "error", "message" : "incorrect answer sent!"}));
		return;
    }

	var question = questions.questions[req.body.id];

	if (question.answer == req.body.answer) {
		res.send(JSON.stringify({"response" : "answer", "answer" : "true"}));
	} else {
		res.send(JSON.stringify({"response" : "answer", "answer" : "false"}));
	}
});

function validateAnswer(req){
	if (req.body.answer == "A" || req.body.answer == "B" || req.body.answer == "C"){
		if (req.body.id >= 0 && req.body.id < questions.questions.length){
			return true;
		} else {
			return false; 
		}
	} else {
		return false;
	}
}

app.listen(process.env.PORT, () => {
    console.log('listening on port: ', process.env.PORT);
});