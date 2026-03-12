var playerAnswer;
var userSession;

function loadQuestion() {

    userSession = getCookie("sessionID");
    var playerScore;
    console.log("SessionID: " + userSession);

    let questionURL = "https://codecyprus.org/th/api/question?session=" + userSession;
    let scoreURL = "https://codecyprus.org/th/api/score?session=" + userSession;

    fetch(scoreURL).then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject1 => {
            if(jsonObject1.status==="OK")
                playerScore=jsonObject1.score;
            else alert(jsonObject1.errorMessages);
        })

    fetch(questionURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject2 => {

            console.log(jsonObject2);
            let status=jsonObject2.status;

            if(status==="OK") {
                if (!jsonObject2.completed) {

                    let question = jsonObject2.questionText;
                    console.log(question);
                    let qType = jsonObject2.questionType;
                    console.log(qType);
                    let questionScore = jsonObject2.currentScore;

                    let pScore = document.getElementById("playerScore");
                    pScore.innerHTML += "<p><b>Score: " + playerScore + "</b></p>";

                    let questionTexBox = document.getElementById("questionTextBox");
                    let questionOptions=document.getElementById("questionOptions");
                    let questionAnswers=document.getElementById("questionAnswers");

                    questionTexBox.innerHTML += "<p>" + question + "</p>";

                    let skipButton="<div id='questionOptions'><button id='skipButton' onclick='skipQuestion()'>SKIP</button><img id='qrIcon' src='/applicationMedia/cameraIcon.png' alt='QR code scanner icon'></div>";
                    questionTexBox.innerHTML+=skipButton;

                    /*let qrScanner="";
                    questionTexBox.innerHTML+=qrScanner;*/


                    if (qType === "BOOLEAN") {
                        let newElement1 = "<button class='answerButton' onClick='validateAnswer(true,\"" + qType + "\")'>True</button>";
                        questionAnswers.innerHTML += newElement1;
                        let newElement2 = "<button class='answerButton' onclick='validateAnswer(false,\"" + qType + "\")'>False</button>";
                        questionAnswers.innerHTML += newElement2;
                    }
                    else if (qType === "INTEGER") {
                        let inputBox = "<p><input type='number' id='answerBox' value='Your Answer'><button type='button' onclick='validateAnswer()'>Submit</button></p>"
                        questionAnswers.innerHTML += inputBox;
                    }
                    else if (qType === "NUMERIC") {

                    }
                    else if (qType === "MCQ") {
                        let buttonA = "<button type='button' onclick='validateAnswer(\"" + "A" + "\",\"" + qType + "\")' class='answerButton'>A</button>";
                        let buttonB = "<button type='button' onclick='validateAnswer(\"" + "B" + "\",\"" + qType + "\")' class='answerButton'>B</button>";
                        let buttonC = "<button type='button' onclick='validateAnswer(\"" + "C" + "\",\"" + qType + "\")' class='answerButton'>C</button>";
                        let buttonD = "<button type='button' onclick='validateAnswer(\"" + "D" + "\",\"" + qType + "\")' class='answerButton'>D</button>";
                        questionAnswers.innerHTML += buttonA + buttonB + buttonC + buttonD;
                    }
                    else if (qType === "TEXT") {
                        let inputBox = "<p><input type='text' id='answerBox'><button type='button' onclick='validateAnswer()'>Submit</button> </p>"
                        questionAnswers.innerHTML += inputBox;
                    }
                }
                else
                    window.location.href="leaderboard.html";

            } else if (status === "ERROR")
                alert(jsonObject.errorMessages);
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
            else if(skipObject.status==="ERROR")
                alert(skipObject.errorMessages);
        })
}

function validateAnswer(answer,type){

    console.log(type);
    if(type==="BOOLEAN" || type==="MCQ"){
        playerAnswer=answer;
    }
    else{
        console.log("blah");
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
        .then(jsonObject3 => {

            let status=jsonObject3.status;

            if(status==="OK"){
                if(jsonObject3.correct===true)
                    window.location.reload();
                else
                    alert(jsonObject3.message)
            }
            else if(status==="ERROR")
                alert(jsonObject3.errorMessages);
        })
}
