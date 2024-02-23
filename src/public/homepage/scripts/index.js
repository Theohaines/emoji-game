//Question stuff
const answerA = document.getElementById("answerA");
const answerB = document.getElementById("answerB");
const answerC = document.getElementById("answerC");
const questionText = document.getElementById("questionText");
const emojiText = document.getElementById("emojiText");
let currentQuestionID = 0;
let currentQuestionType = "";

//Radio stuff
const radioOne = document.getElementById("radioOne");
const radioTwo = document.getElementById("radioTwo");
const radioThree = document.getElementById("radioThree");
const radioFour = document.getElementById("radioFour");
const radioFive = document.getElementById("radioFive");
//text
const radioA = document.getElementById("radioA");
const radioB = document.getElementById("radioB");
const radioC = document.getElementById("radioC");
const radioD = document.getElementById("radioD");
const radioE = document.getElementById("radioE");

//Score stuff
let lives = 3;
let score = 0;
const timerDefault = 500;
let timer;
let timerInterval = 200;
const livestext = document.getElementById("livesText");
const scoretext = document.getElementById("scoreText");

//Answer stuff
const multiAnswerForm = document.getElementById("multiAnswerForm");
const textAnswerForm = document.getElementById("textAnswerForm");
const textAnswerInput = document.getElementById("textAnswerInput");
const radioAnswerForm = document.getElementById("radioAnswerForm");

//SFX stuff
const correctSFX = new Audio("/media/correctSFX.wav");
const incorrectSFX = new Audio("/media/incorrectSFX.wav");

//Misc stuff
let gamestatus = true;
let holdAnswer = [];
let sfxIsMuted = false;
const sfxToggleText = document.getElementById("sfxToggleText");

function getNewQuestion(){
    fetch('/getquestion').then((response) => {
        console.log(response);
        response.json().then((data) => {
            loadNewQuestion(data);
        });
    });
    resetTimer();
}

function loadNewQuestion(data){
    var questionJSON = data;

    currentQuestionID = questionJSON.id;
    currentQuestionType = questionJSON.type;

    if(questionJSON.type == "multi"){
        multiAnswerForm.style.display = "flex";
        textAnswerForm.style.display = "none";
        radioAnswerForm.style.display = "none";
        answerA.textContent = "A: " + questionJSON.answers[0].answerA;
        answerB.textContent = "B: " + questionJSON.answers[0].answerB;
        answerC.textContent = "C: " + questionJSON.answers[0].answerC;
    } else if (questionJSON.type == "text"){
        multiAnswerForm.style.display = "none";
        textAnswerForm.style.display = "flex";
        radioAnswerForm.style.display = "none";
    } else if (questionJSON.type == "radio") {
        multiAnswerForm.style.display = "none";
        textAnswerForm.style.display = "none";
        radioAnswerForm.style.display = "flex";
        radioA.textContent = "A: " + questionJSON.answers[0].answerA;
        radioB.textContent = "B: " + questionJSON.answers[0].answerB;
        radioC.textContent = "C: " + questionJSON.answers[0].answerC;
        radioD.textContent = "D: " + questionJSON.answers[0].answerD;
        radioE.textContent = "E: " + questionJSON.answers[0].answerE;
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
        textAnswerInput.value = "";
    }

    if (currentQuestionType == "radio"){
        answer = holdAnswer;
        holdAnswer = 0;
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
                if (sfxIsMuted == false){
                    incorrectSFX.play();
                }
                updateLivesCounter();
            } else if (responseJSON.answer == "true") {
                score = score + 1000;
                if (sfxIsMuted == false){
                    correctSFX.play();
                }
                queryTimer();
                updateScore();
            } else {
                lives = 0;
                updateLivesCounter();
            }
        
            if (gamestatus == true){
                getNewQuestion();
            }

            resetRadio();
        });
    });
}

function toggleRadio(id, ref){
    var element = document.getElementById(id);
    if (element.style.backgroundColor == "rgb(210, 212, 219)"){
        element.style.backgroundColor = "#666666";
        holdAnswer.push(ref);
    } else {
        element.style.backgroundColor = "rgb(210, 212, 219)";
        
        var index = holdAnswer.indexOf(ref);
        if (index > -1) {
            holdAnswer.splice(index, 1);
        }
    }
}

function resetRadio(){
    radioOne.style.backgroundColor = "#D2D4DB";
    radioTwo.style.backgroundColor = "#D2D4DB";
    radioThree.style.backgroundColor = "#D2D4DB";
    radioFour.style.backgroundColor = "#D2D4DB";
    radioFive.style.backgroundColor = "#D2D4DB";
    holdAnswer = [];
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

function startTimer(){
    var x = setInterval(function() {
        timer = timer - 10;
    }, timerInterval);
}

function resetTimer(){
    timer = timerDefault;
}

function queryTimer(){
    if (timer >= 0) {
        score += timer;
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

function toggleSfxMute(){
    if(sfxIsMuted == true){
        sfxToggleText.textContent = "sfx: 🔊";
        sfxIsMuted = false;
        localStorage.setItem("sfxMuted", false);
    } else {
        sfxToggleText.textContent = "sfx: 🔇";
        sfxIsMuted = true;
        localStorage.setItem("sfxMuted", true);
    }
}

function toggleSystemEmojis(){
    var s = document.styleSheets[0];

    if (localStorage.getItem("systemEmojis") == "true"){
        localStorage.setItem("systemEmojis", "false");
        s.insertRule(".noto-emoji { font-family: 'Noto Emoji' }");
    } else {
        localStorage.setItem("systemEmojis", "true");
        s.deleteRule("noto-emoji", 0);
    }
}

function changeStylesheetRule(stylesheet, selector, property, value) {
	selector = selector.toLowerCase();
	property = property.toLowerCase();
	value = value.toLowerCase();
  
	stylesheet.insertRule(selector + ` { ` + property + `: ` + value + `; }`, styleSheet.cssRules.length);
}

function initialise(){
    sfxIsMuted = localStorage.getItem("sfxMuted");
    if(sfxIsMuted == true){
        sfxToggleText.textContent = "sfx: 🔊";
    } else {
        sfxToggleText.textContent = "sfx: 🔇";
    }
    multiAnswerForm.style.display = "none";
    textAnswerForm.style.display = "none";
    radioAnswerForm.style.display = "none"; 
    getNewQuestion();
    startTimer();
}

initialise();