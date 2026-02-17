var HuntID;
var app="TeamPhoenixApp"

//a function sets them every time the client enters the site
function setCookie(cookieName, cookieValue, expireDays) {

    let date = new Date();
    date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";

}

var date = new Date();
setCookie("date", date.toUTCString());
var expires = "expires=" + date.toUTCString();

setCookie("firstname", expires);

console.log(getCookie("Firstname"));
console.log(getCookie("Lastname"));

//A Function gets the cookie documents
function  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie =
        decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function getChallenges() {

    let huntsArray = [];

    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            console.log(jsonObject);
            huntsArray =jsonObject.treasureHunts;

            let list=document.getElementById("Hunts");

            for(let i=0; i<huntsArray.length; i++) {
                let listItem=document.createElement("li");
                let huntID=huntsArray[i].uuid;
                console.log(huntID);
                 let element="<button onclick='storeHuntID(\""+huntID+"\")' class='huntOption'>"+huntID+"</button>";
                listItem.innerHTML =element;
                list.appendChild(listItem);
            }
        });
}

/*Function which stores the ID of the treasure hunt when the user clicks one of the options from the hunts list*/
function storeHuntID(id){
    HuntID=id;
    console.log("Select Hunt ID: " + id);
}

/* TIM. Function creates a query string with variables "app", "HuntID" and "username"
   and sends it to /api/start. In return, an object is created from the response. */
function startHunt() {
    const username = document.getElementById("username").value;
    if (!username || !username.trim()) {
        alert("Username");
        return;
    }
    if (!HuntID) { //If there is no hunt selected
        alert("Select a treasure hunt first");
        return;
    }

    var URL = "https://codecyprus.org/th/api/start?player=" + encodeURIComponent(username.trim()) + "&app=" + app + "&treasure-hunt-id=" + encodeURIComponent(HuntID);
    fetch(URL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(jsonObject => {
            //An object is created from the response (shown in console)
            var responseObject = jsonObject;
            console.log(responseObject);
            var status = responseObject.status;
            if (status === "OK") {
                var sessionID = responseObject.session;

                setCookie("sessionID", sessionID, 365);
                setCookie("playerName", username.trim(), 365);
                window.location.href = "app.html";
            } else if (status === "ERROR") {
                var errorMessages = responseObject.errorMessages;
                var errorText = Array.isArray(errorMessages) ? errorMessages.join(", ") : String(errorMessages || "Unknown error");
                throw new Error(errorText);
            }
        })
        .catch(function (err) {
            alert("Request failed: " + err.message);
        });
}