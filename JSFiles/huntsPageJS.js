var HuntID;
var app="TeamPhoenixApp";

function checkForActiveSession(){
    if(cookieExists("sessionID")){
        let regDiv=document.getElementById("existingSessionDiv");
        let element="<p>A Treasure Hunt is already in progress. Would you like to continue this session? "
        element+="<button type='button' onclick='loadActiveSession()'>Continue</button></p>"
        regDiv.innerHTML+=element;
    }
}

function loadActiveSession(){
    let response = confirm("Are you sure?");

    if (response) {
        window.location.href="app.html";
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
                let listItem=document.createElement("li");
                let huntID=huntsArray[i].uuid;
                let huntName=huntsArray[i].name
                listItem.innerHTML ="<button onclick='storeHuntID(\""+huntID+"\")' class='huntOption'>"+huntName+"</button>";
                listItem.innerHTML+="<p>"+huntsArray[i].description+"</p>";
                list.appendChild(listItem);
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