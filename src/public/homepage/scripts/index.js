//Question stuff
const answerA = document.getElementById("answerA");
const answerB = document.getElementById("answerB");
const answerC = document.getElementById("answerC");
const questionText = document.getElementById("questionText");
const emojiText = document.getElementById("emojiText");
let currentQuestionID = 0;
let currentQuestionType = "";

//Score stuff
let lives = 3;
let score = 0;
const livestext = document.getElementById("livesText");
const scoretext = document.getElementById("scoreText");

//Answer stuff
const multiAnswerForm = document.getElementById("multiAnswerForm");
const textAnswerForm = document.getElementById("textAnswerForm");
const textAnswerInput = document.getElementById("textAnswerInput");

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
    currentQuestionType = questionJSON.type;

    if(questionJSON.type == "multi"){
        multiAnswerForm.style.display = "flex";
        textAnswerForm.style.display = "none";
        answerA.textContent = "A: " + questionJSON.answers[0].answerA;
        answerB.textContent = "B: " + questionJSON.answers[0].answerB;
        answerC.textContent = "C: " + questionJSON.answers[0].answerC;
    } else if (questionJSON.type == "text"){
        multiAnswerForm.style.display = "none";
        textAnswerForm.style.display = "flex";
    }

    questionText.textContent = questionJSON.question;
    emojiText.textContent = questionJSON.emojis;
}

function submitAnswer(answer){
    if (gamestatus == false){
        location.reload();
    }

    if (currentQuestionType == "text"){
        answer = textAnswerInput.value;
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

function toggleElementVisibility(elementid){
    var element = document.getElementById(elementid);

    if (element.style.display != "none"){
        element.style.display = "none";
    } else {
        element.style.display = "flex";
    }
}

function initialise(){
    multiAnswerForm.style.display = "none";
    textAnswerForm.style.display = "none";
    getNewQuestion();
}

initialise();