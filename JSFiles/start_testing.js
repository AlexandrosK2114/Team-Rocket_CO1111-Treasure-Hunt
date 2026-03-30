let testPairs=[
    {t:'INACTIVE',expected:'The specified treasure hunt is not active right now.'},
    {t:'EMPTY',expected:'The specified treasure hunt is empty (i.e. contains no questions).'},
    {t:'PLAYER',expected:'The specified playerName: Homer, is already in use (try a different one).'},
    {t:'APP',expected:'Missing or empty parameter: app'},
    {t:'UNKNOWN',expected:'Could not find a treasure hunt for the specified id: 123'},
    {t:'MISSING_PARAMETER',expected:'Missing or empty parameter: player,Missing or empty parameter: app,Missing or empty parameter: treasure-hunt-id'}
];

function test(){

    let row="";

    for(i in testPairs){
        let pair=testPairs[i];
        let input=pair.t;
        let ex=pair.expected;
        startHunt(false,input,ex);
    }
}

function startHunt(userInput,Input,expected) {

    if(userInput){
        //From https://www.geeksforgeeks.org/javascript/how-to-get-value-of-selected-radio-button-using-javascript/
        let radioValues=document.getElementsByName("inputOption");

        for(let i=0; i<radioValues.length; i++){
            if(radioValues[i].checked)
                Input=radioValues[i].value;
        }
    }
    
    let Url="https://codecyprus.org/th/test-api/start?player="+Input;

    fetch(Url)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(object => {

            if(object.status==='ERROR'){

                let errorMessage=object.errorMessages;

                if(userInput){

                    let block=document.getElementById('errorMessage');

                    block.innerHTML="<p>"+Input+" : "+errorMessage+"</p>";
                    block.style.display="block";

                }
                else{
                    let row = "<tr>\n" +
                        "<td>" + Input + "</td>" +
                        "<td>" + expected + "</td>"+
                        "<td>" + errorMessage + "</td>"+
                        "<td><img src='" + (expected === String(errorMessage) ? '/applicationMedia/correct.png' : '/applicationMedia/wrong.png') + "' alt='Success or failed icon'/></td><tr>";


                    document.getElementById("unitTest").innerHTML += row;
                }
            }

        })
}

test();