let testPairs=[
    {n:1,expected:1},
    {n:20,expected:20},
    {n:50,expected:50},
    {n:150,expected:150},
    {n:700,expected:700},
    {n:-700,expected:-700},
    {n:-99,expected:-99},
    {n:-1001,expected:-1001},
];

function test(){

    let row="";

    for(i in testPairs){
        let pair=testPairs[i];
        let input=pair.n;
        let ex=pair.expected;
        presentScore(input,false,ex);


    }
}

function presentScore(Input,userInput,expected){

    let URL="https://codecyprus.org/th/test-api/score?score="+String(Input);

    fetch(URL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(object => {

            if(object.status==="OK"){

                let retrievedScore=object.score;

                if(userInput){
                    let block=document.getElementById('userScore');
                    block.innerHTML="<p>Your score is: "+retrievedScore+"</p>";

                }
                else {
                    let row = "<tr>" +
                        "<td>" + Input + "</td>" +
                        "<td>" + expected + "</td>" +
                        "<td>" + retrievedScore + "</td>" +
                        "<td><img src='" + (expected === retrievedScore ? "✅" : "❌") + "' alt='Success or failed icon'/></td></tr>";

                    document.getElementById("unitTest").innerHTML += row;
                }
            }
            else alert("ERROR");
        })
}

test();