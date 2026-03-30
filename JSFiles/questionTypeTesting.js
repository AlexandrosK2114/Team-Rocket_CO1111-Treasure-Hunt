var testPairs=[
    {n:"BOOLEAN",expected:"BOOLEAN"},
    {n:"MCQ",expected:"MCQ"},
    {n:"INTEGER",expected:"INTEGER"},
    {n:"NUMERIC",expected:"NUMERIC"},
    {n:"TEXT",expected:"TEXT"},
];

function test(){
    for(i in testPairs){
        let pair=testPairs[i];
        let input=pair.n;
        let ex=pair.expected;
        evaluateQType(input,false,ex);
    }
}

test();

async function evaluateQType(Input,userInput,expected){

    let URL="https://codecyprus.org/th/test-api/question?completed&question-type="+Input+"&can-be-skipped&requires-location" ;

    if(!(Input==='BOOLEAN'|| Input==='NUMERIC' || Input==='INTEGER' || Input==='MCQ' || Input==='TEXT')){
        alert("ERROR. Incorrect input");
        return;
    }

    fetch(URL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(object => {

            let retrievedType=object.questionType;

            if(userInput){

                let block=document.getElementById("userResult");
                block.innerHTML="<p>Your Input: "+Input+"</p>"
                block.innerHTML+="<p>Retrieved question type: "+retrievedType+"</p>";


                let sampleQuestion=document.getElementById("sampleQuestion");
                sampleQuestion.innerHTML="<p>Sample question layout:</p>"
                sampleQuestion.innerHTML+="<p>"+object.questionText+"</p>"

                if (retrievedType === "BOOLEAN") {
                    let newElement1 = "<button>True</button>";
                    sampleQuestion.innerHTML += newElement1;
                    let newElement2 = "<button>False</button>";
                    sampleQuestion.innerHTML += newElement2;
                }
                else if (retrievedType === "INTEGER") {
                    let inputBox = "<p><button >Submit</button></p>"
                    sampleQuestion.innerHTML += inputBox;
                }
                else if (retrievedType === "NUMERIC") {
                    let inputBox = "<p><button>Submit</button></p>"
                    sampleQuestion.innerHTML += inputBox;

                }
                else if (retrievedType === "MCQ") {
                    let buttonA = "<button>A</button>";
                    let buttonB = "<button>B</button>";
                    let buttonC = "<button>C</button>";
                    let buttonD = "<button>D</button>";
                    sampleQuestion.innerHTML += buttonA + buttonB + buttonC + buttonD;
                }
                else if (retrievedType === "TEXT") {
                    let inputBox = "<p><button>Submit</button> </p>"
                    sampleQuestion.innerHTML += inputBox;
                }

            }
            else {

                let row = "<tr>\n" +
                    "<td>" + Input + "</td>" +
                    "<td>" + expected + "</td>" +
                    "<td>" + retrievedType + "</td>" +
                    "<td><img src='" + (expected === retrievedType ? "✅" : "❌") + "' alt='Success or failed icon'/></td>";

                document.getElementById("unitTest").innerHTML+=row;

            }
        })

}


