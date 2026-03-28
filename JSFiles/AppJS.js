const reloadTime=3500;
var playerAnswer;
var userSession=getCookie("sessionID");

function loadQuestion() {

    updateScore(userSession);

    let questionURL = "https://codecyprus.org/th/api/question?session=" + userSession;

    fetch(questionURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(questionObject => {

            let status=questionObject.status;

            if(status==="OK") {
                if (questionObject.completed!==true) {

                    /*let numOfQuestions=questionObject.numOfQuestions;
                    let currentQuestion=questionObject.currentQuestionIndex+1;

                    let progressionBar=document.getElementById("progressionBar");
                    for(let i=1; i<=numOfQuestions; i++) {

                        let element=document.createElement("span");

                        if(i<currentQuestion)
                            element.style.backgroundColor="black";
                        else
                            element.style.backgroundColor="orange";

                        if (i % 3 === 0)
                            element.innerHTML+="<img src='/applicationMedia/phoenix_feather.png' alt='Phoenix feather image'/>";

                        progressionBar.innerHTML +=element.innerHTML;
                    }*/

                    let question = questionObject.questionText;
                    let qType = questionObject.questionType;

                    let questionTexBox = document.getElementById("questionTextBox");
                    let questionAnswers = document.getElementById("questionAnswers");

                    questionTexBox.innerHTML += "<p>" + question + "</p>";

                    let answerButtons = "<div id='questionOptions'><button class='optionButton' onclick='skipQuestion()'>SKIP</button>";
                    answerButtons += "<button onclick='openCamera()' class='optionButton'><img id='qrIcon' src='/applicationMedia/cameraIcon.png' alt='QR code scanner icon'/></button></div>";
                    questionTexBox.innerHTML += answerButtons;

                    if (qType === "BOOLEAN") {
                        let newElement1 = "<button class='answerButton' onClick='validateAnswer(true,\"" + qType + "\")'>True</button>";
                        questionAnswers.innerHTML += newElement1;
                        let newElement2 = "<button class='answerButton' onclick='validateAnswer(false,\"" + qType + "\")'>False</button>";
                        questionAnswers.innerHTML += newElement2;
                    } else if (qType === "INTEGER") {
                        let inputBox = "<p><input type='number' id='inputField' value='Your Answer'><button type='button' onclick='validateAnswer()' class='submitButton'>Submit</button></p>"
                        questionAnswers.innerHTML += inputBox;
                    } else if (qType === "NUMERIC") {
                        let inputBox = "<p><input type='number' id='inputField' value='Your Answer'><button type='button' onclick='validateAnswer()' class='submitButton'>Submit</button></p>"
                        questionAnswers.innerHTML += inputBox;

                    } else if (qType === "MCQ") {
                        let buttonA = "<button type='button' onclick='validateAnswer(\"" + "A" + "\",\"" + qType + "\")' class='answerButton'>A</button>";
                        let buttonB = "<button type='button' onclick='validateAnswer(\"" + "B" + "\",\"" + qType + "\")' class='answerButton'>B</button>";
                        let buttonC = "<button type='button' onclick='validateAnswer(\"" + "C" + "\",\"" + qType + "\")' class='answerButton'>C</button>";
                        let buttonD = "<button type='button' onclick='validateAnswer(\"" + "D" + "\",\"" + qType + "\")' class='answerButton'>D</button>";
                        questionAnswers.innerHTML += buttonA + buttonB + buttonC + buttonD;
                    } else if (qType === "TEXT") {
                        let inputBox = "<p><input type='text' id='inputField'><button type='button' onclick='validateAnswer()' class='submitButton'>Submit</button> </p>"
                        questionAnswers.innerHTML += inputBox;
                    }
                } else {
                    document.getElementById("question").style.display = "none";
                    document.getElementById("congratulatoryMessage").style.display = "block";
                    setCookie("huntComplete", "true", 1);
                }
            } else if (status === "ERROR")
                alert(questionObject.errorMessages);
        })
}

function skipQuestion() {

    let skipURL = "https://codecyprus.org/th/api/skip?session=" + userSession;

    fetch(skipURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(skipObject => {

            if (skipObject.status === "OK") {
                let message = "</p>Question skipped</p>";
                message += "<p>You've lost " + (-1 * Number(skipObject.scoreAdjustment)) + " points!</p>";
                message += "<p>Loading next question...</p>";
                displayMessage(message, true);
            } else if (skipObject.status === "ERROR") {
                displayMessage(skipObject.errorMessages, false);
            }
        })
}

function validateAnswer(answer, type) {

    if (type === "BOOLEAN" || type === "MCQ") {
        playerAnswer = answer;
    } else {
        playerAnswer = document.getElementById("inputField").value;

        if (playerAnswer === "") {
            displayMessage("Please provide an answer");
            return;
        }
    }
    if (playerAnswer === undefined || playerAnswer === null) {
        alert("ERROR");
        return;
    }

    let answerURL = "https://codecyprus.org/th/api/answer?session=" + userSession + "&answer=" + playerAnswer;

    fetch(answerURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(answerObject => {

            let status = answerObject.status;

            let message = "";

            if (status === "OK") {


                if (answerObject.correct === true) {
                    message += "<p>Well done!</p>";
                    message += "<p>You've gained " + answerObject.scoreAdjustment + " points!</p>";
                    message += "<p>Loading next question...</p>";
                    displayMessage(message, true);
                } else {
                    message += "<p>" + answerObject.message + "</p>";
                    message += "<p>You've lost " + (-1 * Number(answerObject.scoreAdjustment)) + " points!" + "</p>";
                    displayMessage(message, false);
                }
                updateScore();
            } else if (status === "ERROR") {
                alert(answerObject.errorMessages + " Redirecting you to the selection page.");
                deleteCookie("sessionID");
                window.location.href = "huntsPage.html";
            }
        })
}

function updateScore() {

    let scoreURL = "https://codecyprus.org/th/api/score?session=" + userSession;

    fetch(scoreURL).then(response => response.json()) // Parse JSON text to JavaScript object
        .then(scoreObject => {
            if (scoreObject.status === "OK") {
                playerScore = scoreObject.score;
                let pScore = document.getElementById("playerScore");
                pScore.innerHTML = "<p><b>Score: " + playerScore + "</b></p>";
            } else alert(scoreObject.errorMessages);
        })
}

function displayMessage(message, reload) {

    let messageContainer = document.getElementById("answerMessage");

    messageContainer.innerHTML = message;
    messageContainer.style.display = "block";

    if (reload)
        setTimeout(reloadPage, reloadTime);
}

function reloadPage() {
    window.location.reload();
}

function openCamera() {
    window.location.href = "reader.html";
}
