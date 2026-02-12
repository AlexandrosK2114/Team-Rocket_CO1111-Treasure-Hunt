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
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
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
                listItem.innerHTML =  huntID;
                list.appendChild(listItem);
            }
        });


}

//QR READER SECTION
/*function QRReader() {


    scanner.addListener('scan', function (content) {}

    Instascan.Camera.getCameras()*/