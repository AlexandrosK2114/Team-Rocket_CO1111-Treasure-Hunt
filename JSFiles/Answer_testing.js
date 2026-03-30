let testPairs=[
    {n:true,expected:true},
    {n:false,expected:false},
];

function test(){

    let row="";

    for(i in testPairs){
        let pair=testPairs[i];
        let input=pair.n;
        let ex=pair.expected;
        validateAnswer(input,ex,false);


    }
}

function validateAnswer(Input,expected,userInput){

    console.log(Input);
    let URL="https://codecyprus.org/th/test-api/answer?correct="+Input+"&completed=false";

    fetch(URL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(object => {

            if(object.status==="OK"){

                let answerStatus=object.correct;
                if(userInput){
                    let response;

                    if(answerStatus===true){
                        response="<p>"+object.message+"</p>";
                        response+="<p>You have gained: "+object.scoreAdjustment+" points</p>";
                    }
                    else{
                        response="<p>"+object.message+"</p>";
                        response+="<p>You have lost: "+(-1*Number(object.scoreAdjustment))+" points</p>";
                    }

                    document.getElementById("response").innerHTML=response;
                }
                else {
                    let row = "<tr>" +
                        "<td>" + Input + "</td>" +
                        "<td>" + expected + "</td>" +
                        "<td>" +String(answerStatus)+ "</td>" +
                        "<td>" + (expected === answerStatus ? "✅" : "❌") + "</td>\n" +
                        "</tr";

                    document.getElementById("unitTest").innerHTML += row;
                }
            }
            else alert("ERROR");
        })
}

test();