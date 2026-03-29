//Constant used to delay loading the next question, so users can see the presented messages
const reloadTime=3500;

//Global variables used for storing player answers and the session ID
var playerAnswer;
var userSession=getCookie("sessionID");

//Function used to load a question sent from the API
function loadQuestion() {

    //Calling updateScore to load the user's score from the API
    updateScore(false);

    //Constructing the necessary URL with session ID parameter, needed to call /api/question
    let questionURL = "https://codecyprus.org/th/api/question?session=" + userSession;

    //Using fetch() to retrieve the JSON object which contains the question information
    fetch(questionURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(questionObject => {

            let status=questionObject.status;

            if(status==="OK") {
                //If the treasure hunt has not been completed
                if (questionObject.completed!==true) {

                    let numOfQuestions=questionObject.numOfQuestions;//Retrieve number of questions
                    let currentQuestion=questionObject.currentQuestionIndex+1;//Retrieve the current question number
                    let locationNeeded=questionObject.requiresLocation;//Retrieve whether the current question is location sensitive

                    //Display progression information for the user(current question/total questions)
                    let block=document.getElementById("progress");
                    block.innerHTML+="<p>Question: "+currentQuestion+"/"+numOfQuestions+"</p>";

                    //If the questions is location sensitive, display an additional icon to notify the user
                    if(locationNeeded)
                        block.innerHTML+="<span class='material-icons'>location_pin</span>"

                    let question = questionObject.questionText;//Retrieve the question text
                    let qType = questionObject.questionType;//Retrieve the question type

                    //Load the containers needed to display the question text and the available answers
                    let questionTexBox = document.getElementById("questionTextBox");
                    let questionAnswers = document.getElementById("questionAnswers");

                    //Add the question text to the appropriate container
                    questionTexBox.innerHTML += "<p>" + question + "</p>";

                    //Creating a skip button and a qr reader opener and adding them under the question text
                    let answerButtons = "<div id='questionOptions'><button class='optionButton' onclick='skipQuestion()'>SKIP</button>";
                    answerButtons += "<button onclick='openCamera()' class='optionButton'><img id='qrIcon' src='../applicationMedia/cameraIcon.png' alt='QR code scanner icon'/></button></div>";
                    questionTexBox.innerHTML += answerButtons;

                    //Using the retrieved question type to create the necessary answer options
                    //BOOLEAN-> true or false buttons.
                    if (qType === "BOOLEAN") {
                        let newElement1 = "<button class='answerButton' onClick='validateAnswer(true,\"" + qType + "\",\"" + locationNeeded + "\")'>True</button>";
                        questionAnswers.innerHTML += newElement1;
                        let newElement2 = "<button class='answerButton' onclick='validateAnswer(false,\"" + qType + "\",\"" + locationNeeded + "\")'>False</button>";
                        questionAnswers.innerHTML += newElement2;
                    }
                    //INTEGER-> creation of input field of type number and submit button
                    else if (qType === "INTEGER") {
                        let inputBox = "<p><input type='number' id='inputField' value='Your Answer'><button type='button' onclick='validateAnswer(0,0,\"" + locationNeeded + "\")' class='submitButton'>Submit</button></p>"
                        questionAnswers.innerHTML += inputBox;
                    }
                    //Numeric-> creation of input field of type number and submit button
                    else if (qType === "NUMERIC") {
                        let inputBox = "<p><input type='number' id='inputField' value='Your Answer'><button type='button' onclick='validateAnswer(0,0,\"" + locationNeeded + "\")' class='submitButton'>Submit</button></p>"
                        questionAnswers.innerHTML += inputBox;

                    }
                    //MCQ-> creation of A B C D buttons
                    else if (qType === "MCQ") {
                        let buttonA = "<button type='button' onclick='validateAnswer(\"" + "A" + "\",\"" + qType + "\",\"" + locationNeeded + "\")' class='answerButton'>A</button>";
                        let buttonB = "<button type='button' onclick='validateAnswer(\"" + "B" + "\",\"" + qType + "\",\"" + locationNeeded + "\")' class='answerButton'>B</button>";
                        let buttonC = "<button type='button' onclick='validateAnswer(\"" + "C" + "\",\"" + qType + "\",\"" + locationNeeded + "\")' class='answerButton'>C</button>";
                        let buttonD = "<button type='button' onclick='validateAnswer(\"" + "D" + "\",\"" + qType + "\",\"" + locationNeeded + "\")' class='answerButton'>D</button>";
                        questionAnswers.innerHTML += buttonA + buttonB + buttonC + buttonD;
                    }
                    //TEXT-> creation of input field of type text with submit button
                    else if (qType === "TEXT") {
                        let inputBox = "<p><input type='text' id='inputField'><button type='button' onclick='validateAnswer(0,0,\"" + locationNeeded + "\");' class='submitButton'>Submit</button> </p>"
                        questionAnswers.innerHTML += inputBox;
                    }

                }
                //If the user has answered all the questions, a congratulatory message is shown with their score
                //and links to the homepage and leaderboard
                //The huntComplete cookie's value is made to true to indicate the end of the session
                else {
                    document.getElementById("question").style.display = "none";
                    document.getElementById("congratulatoryMessage").style.display = "block";
                    updateScore(true);
                    setCookie("huntComplete", "true", 1);
                }
            //Error alert in case the API call was unsuccessful
            } else if (status === "ERROR")
                alert(questionObject.errorMessages);

        })
}

//F
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

//Function used to validate the user's answer when it is submitted
function validateAnswer(answer, type,locationNeeded) {

    //If the question type is boolean or multiple chose, the answer is that of the passed argument
    if (type === "BOOLEAN" || type === "MCQ") {
        playerAnswer = answer;

    //If the question type is any other, retrieve the answer directly from the input field
    } else {
        playerAnswer = document.getElementById("inputField").value;

        //Inform the user that an answer is required id they submit nothing
        if (playerAnswer === "") {
            displayMessage("Please provide an answer");
            return;
        }
    }
    //Perform an error check in case the answer is invalid
    if (playerAnswer === undefined || playerAnswer === null) {
        alert("ERROR");
        return;
    }

    //Update the user's location to their current one if the answer is location sensitive
    if(locationNeeded==='true') getLocation();

    //Constructing the URL needed to call /api/anser with parameters session ID and the player's answer
    let answerURL = "https://codecyprus.org/th/api/answer?session=" + userSession + "&answer=" + playerAnswer;

    //Using fetch to retrieve the JSON object containing the answer information from the API
    fetch(answerURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(answerObject => {

            let status = answerObject.status;

            let message = "";

            //If the call was successful
            if (status === "OK") {

                //If the answer was correct create and display a congratulatory message
                if (answerObject.correct === true) {
                    message += "<p>Well done!</p>";
                    message += "<p>You've gained " + answerObject.scoreAdjustment + " points!</p>";
                    message += "<p>Loading next question...</p>";
                    //True indicates the page must be reloaded to load the next question
                    displayMessage(message, true);
                //If the answer was incorrect, also inform the user with an appropriate message
                } else {
                    message += "<p>" + answerObject.message + "</p>";
                    message += "<p>You've lost " + (-1 * Number(answerObject.scoreAdjustment)) + " points!" + "</p>";
                    //False indicates the page must not be reloaded
                    displayMessage(message, false);
                }
                //In both cases update the user's score
                updateScore();

            //If the call is not successful, that means the session is out of time
            //Thus a message is shown with the user's score and links to the leaderboard and homepage
            //The huntComplete cookie's value is made to true to indicate the end of the session
            } else if (status === "ERROR") {
                document.getElementById("question").style.display = "none";
                document.getElementById("finishedMessage").style.display = "block";
                updateScore(true);
                setCookie("huntComplete", "true", 1);
            }
        })
}

//Function used to display and update the user's score
function updateScore(finished) {

    //Constructing the URL needed to call /api/score with the session ID parameter
    let scoreURL = "https://codecyprus.org/th/api/score?session=" + userSession;

    //Using fetch to retrieve the JSON object containing the score information from the API
    fetch(scoreURL).then(response => response.json())
        .then(scoreObject => {
            if (scoreObject.status === "OK") {

                //Retrieving the current score of the player
                let playerScore = scoreObject.score;

                console.log(finished);
                //If the session has concluded, the current score is displayed in the final message
                if(finished===true){
                    document.getElementById("finalScore").innerHTML+=playerScore;
                    document.getElementById("finishedScore").innerHTML+=playerScore;
                }

                //If the session is ongoing, the displayed score inside the associated container is updated
                //to reflect the current score
                else {
                    let pScore = document.getElementById("playerScore");
                    pScore.innerHTML = "<p><b>Score: " + playerScore + "</b></p>";
                }
            } else alert(scoreObject.errorMessages);
        })
}

//Function used to display messages
function displayMessage(message, reload) {

    //Loading the message container
    let messageContainer = document.getElementById("answerMessage");

    messageContainer.innerHTML = message;
    messageContainer.style.display = "block";

    //This executes only when the message is about skipping or answering questions correctly
    //In these two cases, the page is reloaded to display the next question
    //SetTimeout() is used to allow the user to use the message before the page is reloaded
    if (reload)
        setTimeout(reloadPage, reloadTime);
}

//Function which reloads the page when a question is answered correctly or when it is skipped
function reloadPage() {
    window.location.reload();
}

//Function which redirects the user to the qr reader page when the associated button is pressed
function openCamera() {
    window.location.href = "reader.html";
}
