function loadQuestion() {
    var userSession = getCookie("sessionID");
    console.log("SessionID: "+ userSession);

    let URL="https://codecyprus.org/th/api/question?session=" + userSession;

    fetch(URL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {

            let status=jsonObject.status;

            if(status==="OK"){
                if(!jsonObject.completed){

                    let question=jsonObject.questionText;
                    console.log(question);
                    let type=jsonObject.questionType;
                    let questionScore=jsonObject.currentScore;
                    let questionDiv=document.getElementById("questionDivision");

                    let questionTexBox=document.getElementById("questionTextBox");
                    questionTexBox.innerHTML+="<p>"+question+"</p>";

                    if(type==="BOOLEAN"){

                    }
                    else if(type==="INTEGER"){

                    }
                    else if(type==="NUMERIC"){

                    }
                    else if(type==="MCQ"){

                    }
                    else if(type==="TEXT"){

                    }

                }
            }
            else if(status==="ERROR")
                alert(jsonObject.errorMessages);

        })
}