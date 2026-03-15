var HuntID;
var app="TeamPhoenixApp";

async function getChallenges() {

    let huntsArray = [];

    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            huntsArray =jsonObject.treasureHunts;

            let list=document.getElementById("Hunts");

            for(let i=0; i<huntsArray.length; i++) {
                let listItem=document.createElement("li");
                let huntID=huntsArray[i].uuid;
                listItem.innerHTML ="<button onclick='storeHuntID(\""+huntID+"\")' class='huntOption'>Hunt "+(i+1)+"</button>";
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

    if (cookieExists("sessionID")) {
        let response = confirm("A game is already in progress. Would you like to continue?");
        if (response) {
            window.location.href = "app.html";
        }
        else
            deleteCookie("sessionID");
    }

    const username = document.getElementById("username").value;

    if (!username || !username.trim()) {
        displayErrorMessage("Please add a username");
        return;
    }
    if (!HuntID) { //If there is no hunt selected
        displayErrorMessage("Please select a treasure hunt");
        return;
    }

    else {
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
}

function displayErrorMessage(message){
    let errorMessBox=document.getElementById("errorMessage");
    errorMessBox.innerText=message;
    errorMessBox.style.display="block";
}