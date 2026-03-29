//Global variables used to store the selected hun and aoo name
var HuntID;
var app="TeamPhoenixApp";

//Function which checks if there is an active treasure hunt session
function checkForActiveSession(){
    //Checking if an active session exists using cookies
    if(cookieExists("sessionID")){

        //Using another cookie to check if the active session relates to a completed treasure hunt
        let huntCompleted=getCookie("huntComplete");
        let block=document.getElementById("existingSessionDiv");
        let element;

        //If it is completed display a message in the selection page to ask if the user would like
        //to view their placement. Also display button which links to the leaderboard page
        if(huntCompleted==="true"){
            element="<p>Would you like to view your placement in your previous session?</p>"
            element+="<p><button type='button' onclick='loadActiveSession(true)'>Leaderboard</button></p>"
            block.innerHTML+=element;
        }
        //If it is not completed, display a message to ask if the user would like to continue the session
        //Also display button which links to the app page.
        else {
            element = "<p>A Treasure Hunt is already in progress. Would you like to continue this session?</p> "
            element += "<p><button type='button' onclick='loadActiveSession(false)'>Continue</button></p>"
            block.innerHTML += element;
        }
        block.style.display="block";
    }
}

//Function used to load an active session which has not been finished yet
//Displaying a confirm-alert first
function loadActiveSession(completed){
    let response = confirm("Are you sure?");

    if (response) {
        if(completed) window.location.href="leaderboard.html";
        else window.location.href="app.html";
    }

}

//Asynchronous function used to retrieve the available treasure hunts from the API
async function getChallenges() {

    //Array used to store the treasure hunt objects
    let huntsArray = [];

    //Utilising fetch() to call /api/list to retrieve the JSON object which contains the treasure hunts
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(jsonObject => {
            huntsArray =jsonObject.treasureHunts;

            //Creating each treasure hunt contained in the object as a list item and appending it to the list
            let list=document.getElementById("Hunts");

            for(let i=0; i<huntsArray.length; i++) {
                let huntID=huntsArray[i].uuid;
                let huntName=huntsArray[i].name;
                let listItem="<li onclick='storeHuntID(\""+huntID+"\")'><h2>"+huntName+"</h2><p>"+huntsArray[i].description+"</p></li>";
                list.innerHTML+=listItem;
            }
        });
}

/*Function which stores the ID of the treasure hunt when the user clicks one of the options from the hunt list*/
function storeHuntID(id){
    HuntID=id;
    console.log("Select Hunt ID: " + id);
}

/*Function creates a query string with variables "app", "HuntID" and "username"
and sends it to /api/start. In return, an object is created from the response. */
function startHunt() {

    //Retrieving the username from the input field
    const username = document.getElementById("username").value;

    //Performing error checks in case the provided username or treasure hunt ID are missing or invalid
    if (!username || !username.trim()) {
        displayErrorMessage("Please add a username");
        return;
    }
    if (!HuntID) { //If there is no hunt selected
        displayErrorMessage("Please select a treasure hunt");
        return;
    }

    let response=true;

    //Informing that the active session will be overwritten if one exists
    if(cookieExists("sessionID")) {

        response = confirm("Your previous session will be lost. Would you like to proceed?");

    }

    //If the user wishes to proceed, then a call to /api/start is made to save the user's information
    if (response) {

        //Constructing the URL with the required parameters (app, HuntID and username)
        let URL = "https://codecyprus.org/th/api/start?player=" + username.trim() + "&app=" + app + "&treasure-hunt-id=" + HuntID;

        fetch(URL)
            .then(response => response.json()) // Parse JSON text to JavaScript object
            .then(jsonObject => {

                //An object is created from the response (shown in console)
                let responseObject = jsonObject;
                let status = responseObject.status;

                //If all is well, the session ID and username are stored into cookies
                //An additional cookie is saved which indicates whether the session has been completed or reached its end.
                if (status === "OK") {
                    let sessionID = responseObject.session;

                    setCookie("sessionID", sessionID, 1);
                    setCookie("playerName", username.trim(), 1);
                    setCookie("huntComplete","false", 1);

                    //After successfully creating the cookies, the user is redirected to the playing page
                    window.location.href = "app.html";

                } else if (status === "ERROR") {
                    displayErrorMessage(jsonObject.errorMessages);
                }
            })
    }

}

//Function used to display error messages when something goes wrong during registration
//An appropriate message is displayed when the does not include username, does not choose a hunt
//the chosen username is taken and the chosen treasure hunt is inactive.
function displayErrorMessage(message){
    let errorMessBox=document.getElementById("errorMessage");
    errorMessBox.innerText=message;
    errorMessBox.style.display="block";
}