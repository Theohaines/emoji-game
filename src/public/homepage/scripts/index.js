const answerForm = document.getElementById('answerForm');
const answerInput = document.getElementById('answerInput');

//Question stuff
const answerA = document.getElementById("answerA");
const answerB = document.getElementById("answerB");
const answerC = document.getElementById("answerC");
const questionText = document.getElementById("questionText");
const emojiText = document.getElementById("emojiText");
let currentQuestionID = 0;

//Score stuff
let lives = 3;
let score = 0;
const livestext = document.getElementById("livesText");
const scoretext = document.getElementById("scoreText");

//Misc stuff
let gamestatus = true;

function getNewQuestion(){
    fetch('/getquestion').then((response) => {
        console.log(response);
        response.json().then((data) => {
            loadNewQuestion(data);
        });
    });
}

function loadNewQuestion(data){
    var questionJSON = data;

    currentQuestionID = questionJSON.id;

    answerA.textContent = "A: " + questionJSON.answers[0].answerA;
    answerB.textContent = "B: " + questionJSON.answers[0].answerB;
    answerC.textContent = "C: " + questionJSON.answers[0].answerC;
    questionText.textContent = questionJSON.question;
    emojiText.textContent = questionJSON.emojis;
}

function submitAnswer(answer){
    if (gamestatus == false){
        location.reload();
    }

    JSON.stringify(answer, currentQuestionID);

    fetch('/submitanswer', {
        method :'POST',
        headers : { 'Content-Type': 'application/json' },
        body : JSON.stringify({"answer" : answer, id : currentQuestionID})
    })
    .then((response) => {
        console.log(response);
        response.json().then((data) => {
            var responseJSON = data;

            console.log(responseJSON.answer)
        
            if (responseJSON.answer == "false"){
                lives = lives - 1;
                updateLivesCounter();
            } else if (responseJSON.answer == "true") {
                score = score + 200;
                updateScore();
            } else {
                lives = 0;
                updateLivesCounter();
            }
        
            if (gamestatus == true){
                getNewQuestion();
            }
        });
    });
}

function updateScore(){
    scoretext.innerText = "score: " + score.toString();
}

function updateLivesCounter(){
    if (lives == 3){
        livestext.innerText = "❤️ ❤️ ❤️";
    } else if (lives == 2) {
        livestext.innerText = "❤️ ❤️ 💔";
    } else if (lives == 1) {
        livestext.innerText = "❤️ 💔 💔";
    } else {
        livestext.innerText = "💔 💔 💔";
        gamestatus = false;
        gameover();
    }
}

function gameover(){
    emojiText.textContent = "press any answer to restart";
    questionText.textContent = "Game over!";

    answerA.textContent = "press to restart";
    answerB.textContent = "press to restart";
    answerC.textContent = "press to restart";
}

getNewQuestion();