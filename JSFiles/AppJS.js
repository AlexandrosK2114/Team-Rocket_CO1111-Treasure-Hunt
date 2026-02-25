function loadQuestion() {
    var userSession = getCookie("sessionID");
    console.log("SessionID: "+ userSession);

    let URL="https://codecyprus.org/th/api/question?session=" + userSession;

    fetch(URL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {

            console.log(jsonObject);
            let status=jsonObject.status;

            if(status==="OK") {
                if (!jsonObject.completed) {

                    let question = jsonObject.questionText;
                    console.log(question);
                    let type = jsonObject.questionType;
                    let questionScore = jsonObject.currentScore;
                    let questionDiv = document.getElementById("questionDivision");

                    let questionTexBox = document.getElementById("questionTextBox");
                    questionTexBox.innerHTML += "<p>" + question + "</p>";

                    if (type === "BOOLEAN") {
                        let answerOptions = document.getElementById("questionAnswers");
                        let newElement1 = "<button id='trueBtn' class='tf-btn' onClick='selectAnswer(true)'>True</button>";
                        answerOptions.innerHTML += newElement1;
                        let newElement2 = "<button id='falseBtn' class='tf-btn' onclick='selectAnswer(false)'>False</button>";
                        answerOptions.innerHTML += newElement2;
                    } else if (type === "INTEGER") {

                    } else if (type === "NUMERIC") {

                    } else if (type === "MCQ") {

                    } else if (type === "TEXT") {

                    }

                } else if (status === "ERROR")
                    alert(jsonObject.errorMessages);
            }
        })
}
