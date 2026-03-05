function getLeaderBoard(sessionID) {
    var URL = "https://codecyprus.org/th/api/leaderboard?session=" + sessionID + "&sorted";
    fetch(URL)
        .then(response => response.json()) //Parse JSON text to JavaScript object
        .then(jsonObject => {
            var players = jsonObject.leaderboard;
            document.getElementById("end").remove();
            i = document.getElementById("myWraper");
            i.innerHTML+="<div id='secondWrap'>" +
                "<h1>Your position in leaderboard is: "+findMinePosition(jsonObject, getCookie("playerName"))+"</h1>";
            let k = document.getElementById("secondWrap");
            for(let j = 0; j < 10; j++){
                k.innerHTML+= "<h2>Player "+(j+1)+" "+jsonObject.leaderboard[j].player+" and his score is: "+jsonObject.leaderboard[j].score+"</h2>";
            }

            i.innerHTML+="<input type='button' class='buttons' onclick='startAgain()' value='Start Again!'>" +
                "</div>";
        });
}

