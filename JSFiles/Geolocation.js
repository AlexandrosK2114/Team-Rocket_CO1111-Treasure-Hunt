const recall=30000;

var longitude;
var latitude;

//Function which stores the user's location
function storePosition(position){
    longitude=position.coords.longitude;
    latitude=position.coords.longitude;
    console.log("Longitude: "+longitude);
    console.log("Latitude: "+latitude);

    let userSession=getCookie("sessionID");
    let locationURL="https://codecyprus.org/th/api/location?session="+userSession+"&latitude="+latitude+"&longitude="+longitude;

    fetch(locationURL)
        .then(response => response.json()) // Parse JSON text to JavaScript object
        .then(locationObject => {

            console.log(locationObject.message);

        })
}

//Function which retrieves the location of the user
function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(storePosition);
    }
    else {
        alert("Retrieval of Geolocation not permitted");
    }
}

getLocation();
//Updating the user's location every 30 seconds using a constant variable
setInterval(getLocation,recall);