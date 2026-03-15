var playerAnswer;
var userSession=getCookie("sessionID");

function loadQuestion() {

    let questionURL = "https://codecyprus.org/th/api/question?session=" + userSession;

    updateScore(userSession);

    fetch(questionURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(questionObject => {

            let status=questionObject.status;

            if(status==="OK") {
                if (!questionObject.completed===true) {

                    let question = questionObject.questionText;
                    let qType = questionObject.questionType;

                    let questionTexBox = document.getElementById("questionTextBox");
                    let questionAnswers=document.getElementById("questionAnswers");

                    questionTexBox.innerHTML += "<p>" + question + "</p>";

                    let skipButton="<div id='questionOptions'><button class='appButton' onclick='skipQuestion()'>SKIP</button><img id='qrIcon' src='/applicationMedia/cameraIcon.png' alt='QR code scanner icon'></div>";
                    questionTexBox.innerHTML+=skipButton;

                    /*let qrScanner="";
                    questionTexBox.innerHTML+=qrScanner;*/

                    if (qType === "BOOLEAN") {
                        let newElement1 = "<button class='appButton' onClick='validateAnswer(true,\"" + qType + "\")'>True</button>";
                        questionAnswers.innerHTML += newElement1;
                        let newElement2 = "<button class='appButton' onclick='validateAnswer(false,\"" + qType + "\")'>False</button>";
                        questionAnswers.innerHTML += newElement2;
                    }
                    else if (qType === "INTEGER") {
                        let inputBox = "<p><input type='number' id='answerBox' value='Your Answer'><button type='button' onclick='validateAnswer()' class='appButton'>Submit</button></p>"
                        questionAnswers.innerHTML += inputBox;
                    }
                    else if (qType === "NUMERIC") {
                        let inputBox = "<p><input type='number' id='answerBox' value='Your Answer'><button type='button' onclick='validateAnswer()'>Submit</button></p>"
                        questionAnswers.innerHTML += inputBox;

                    }
                    else if (qType === "MCQ") {
                        let buttonA = "<button type='button' onclick='validateAnswer(\"" + "A" + "\",\"" + qType + "\")' class='appButton'>A</button>";
                        let buttonB = "<button type='button' onclick='validateAnswer(\"" + "B" + "\",\"" + qType + "\")' class='appButton'>B</button>";
                        let buttonC = "<button type='button' onclick='validateAnswer(\"" + "C" + "\",\"" + qType + "\")' class='appButton'>C</button>";
                        let buttonD = "<button type='button' onclick='validateAnswer(\"" + "D" + "\",\"" + qType + "\")' class='appButton'>D</button>";
                        questionAnswers.innerHTML += buttonA + buttonB + buttonC + buttonD;
                    }
                    else if (qType === "TEXT") {
                        let inputBox = "<p><input type='text' id='answerBox'><button type='button' onclick='validateAnswer()' class='appButton'>Submit</button> </p>"
                        questionAnswers.innerHTML += inputBox;
                    }
                }
                else
                    window.location.href="leaderboard.html";

            } else if (status === "ERROR")
                alert(questionObject.errorMessages);
        })
}

function skipQuestion(){

    let skipURL="https://codecyprus.org/th/api/skip?session="+userSession;

    fetch(skipURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(skipObject => {

            if(skipObject.status==="OK"){
                alert("Question Skipped");
                window.location.reload();
            }
            else if(skipObject.status==="ERROR") {
                let messageContainer = document.getElementById("answerMessage");
                messageContainer.style.display="block";
                messageContainer.innerHTML = "<p>" +skipObject.errorMessages+ + "</p>";
            }
        })
}

function validateAnswer(answer,type){

    if(type==="BOOLEAN" || type==="MCQ"){
        playerAnswer=answer;
    }
    else{
        playerAnswer=document.getElementById("answerBox").value;
    }
    if(!playerAnswer){
        alert("ERROR");
        return;
    }

    console.log(playerAnswer);
    console.log(userSession);
    let answerURL="https://codecyprus.org/th/api/answer?session="+userSession+"&answer="+playerAnswer;

    fetch(answerURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(answerObject => {

            let status=answerObject.status;

            if(status==="OK"){
                if(answerObject.correct===true) {
                    alert(answerObject.message);
                    window.location.reload();
                }
                else {
                    let messageContainer = document.getElementById("answerMessage");
                    messageContainer.style.display="block";
                    messageContainer.innerHTML = "<p>" + answerObject.message + "</p>";
                    updateScore();
                }
            }
            else if(status==="ERROR")
                alert(answerObject.errorMessages);
        })
}

function updateScore(){

    let scoreURL = "https://codecyprus.org/th/api/score?session=" + userSession;

    fetch(scoreURL).then(response => response.json()) // Parse JSON text to JavaScript object
        .then(scoreObject => {
            if(scoreObject.status==="OK") {
                playerScore = scoreObject.score;
                let pScore = document.getElementById("playerScore");
                pScore.innerHTML = "<p><b>Score: " + playerScore + "</b></p>";
            }
            else alert(scoreObject.errorMessages);
        })

}
