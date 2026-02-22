const recall=30000;

var longitude;
var latitude;

//Function which stores the user's location
function storePosition(position){
    longitude=position.coords.longitude;
    latitude=position.coords.longitude;
    console.log("Longitude: "+longitude);
    console.log("Latitude: "+latitude);
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