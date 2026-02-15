var HuntID;
var app="TeamPhoenixApp"

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
                 let element="<button onclick='storeHuntID(\""+huntID+"\")' id='Username'>"+huntID+"</button>";
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

/*TIM. Function should create a query string with variables "app", "HuntID" and "username"
 and send it to /api/start. In return, an object should be created with the response.
 */
async function startHunt(){

    let username=document.getElementById("Username").value;
}