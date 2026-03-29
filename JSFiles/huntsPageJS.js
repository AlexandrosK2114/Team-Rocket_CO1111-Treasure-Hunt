var HuntID;
var app="TeamPhoenixApp";

function checkForActiveSession(){
    if(cookieExists("sessionID")){

        let huntCompleted=getCookie("huntComplete");
        let block=document.getElementById("existingSessionDiv");
        let element="";

        if(huntCompleted==="true"){
            element="<p>Would you like to view your placement in your previous session?</p>"
            element+="<p><button type='button' onclick='loadActiveSession(true)'>Leaderboard</button></p>"
            block.innerHTML+=element;
        }
        else {
            element = "<p>A Treasure Hunt is already in progress. Would you like to continue this session?</p> "
            element += "<p><button type='button' onclick='loadActiveSession(false)'>Continue</button></p>"
            block.innerHTML += element;
        }
        block.style.display="block";
    }
}

function loadActiveSession(completed){
    let response = confirm("Are you sure?");

    if (response) {
        if(completed) window.location.href="leaderboard.html";
        else window.location.href="app.html";
    }

}

async function getChallenges() {

    let huntsArray = [];

    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(jsonObject => {
            huntsArray =jsonObject.treasureHunts;

            let list=document.getElementById("Hunts");

            for(let i=0; i<huntsArray.length; i++) {
                let huntID=huntsArray[i].uuid;
                let huntName=huntsArray[i].name;
                let listItem="<li onclick='storeHuntID(\""+huntID+"\")'><h2>"+huntName+"</h2><p>"+huntsArray[i].description+"</p></li>";
                list.innerHTML+=listItem;
            }
        });
}

/*Function which stores the ID of the treasure hunt when the user clicks one of the options from the hunts list*/
function storeHuntID(id){
    HuntID=id;
    console.log("Select Hunt ID: " + id);
}

/*Function creates a query string with variables "app", "HuntID" and "username"
   and sends it to /api/start. In return, an object is created from the response. */
function startHunt() {

    const username = document.getElementById("username").value;

    if (!username || !username.trim()) {
        displayErrorMessage("Please add a username");
        return;
    }
    if (!HuntID) { //If there is no hunt selected
        displayErrorMessage("Please select a treasure hunt");
        return;
    }

    let response=true;

    if(cookieExists("sessionID")) {

        response = confirm("Your previous session will be lost. Would you like to proceed?");

    }

    if (response) {

        let URL = "https://codecyprus.org/th/api/start?player=" + username.trim() + "&app=" + app + "&treasure-hunt-id=" + HuntID;
        console.log(URL);
        fetch(URL)
            .then(response => response.json()) // Parse JSON text to JavaScript object
            .then(jsonObject => {

                //An object is created from the response (shown in console)
                let responseObject = jsonObject;
                console.log(responseObject);
                let status = responseObject.status;

                if (status === "OK") {
                    let sessionID = responseObject.session;

                    setCookie("sessionID", sessionID, 1);
                    setCookie("playerName", username.trim(), 1);
                    setCookie("huntComplete","false", 1);
                    window.location.href = "app.html";

                } else if (status === "ERROR") {
                    displayErrorMessage(jsonObject.errorMessages);
                }
            })
    }
    else return;


}

function displayErrorMessage(message){
    let errorMessBox=document.getElementById("errorMessage");
    errorMessBox.innerText=message;
    errorMessBox.style.display="block";
}