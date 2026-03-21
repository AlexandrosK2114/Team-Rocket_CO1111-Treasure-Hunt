function findMinePosition(data, playerName) {
    const leaderboard = data?.leaderboard || [];
    const index = leaderboard.findIndex(entry =>
        String(entry.player).toLowerCase() === String(playerName || "").toLowerCase()
    );
    if (index >= 0) {
        return index + 1;
    } else {
        return 0;
    }
}

function goBack() {
    const gameContainer = document.getElementById('game-container');
    const leaderboardContainer = document.getElementById('leaderboard');

    if (leaderboardContainer) leaderboardContainer.style.display = 'none';
    if (gameContainer) gameContainer.style.display = 'block';
}

function startAgain() {
    if (typeof deleteCookie === "function") {
        deleteCookie("sessionID");
        deleteCookie("playerName");
    }
    window.location.href = "huntsPage.html";
}

async function showLeaderboard(sorted, limit, completionMode) {
    sorted = sorted !== false;
    limit = limit || 10;
    completionMode = completionMode || false;
    const leaderboardContainer = document.getElementById('leaderboard');
    const gameContainer = document.getElementById('game-container');

    if (!leaderboardContainer) {
        console.error('Missing #leaderboard element in HTML.');
        return;
    }
    if (!completionMode && !gameContainer) {
        console.error('Missing #game-container element in HTML.');
        return;
    }

    const sessionId = getCookie("sessionID") || sessionStorage.getItem("session");
    if (!sessionId) {
        alert("No session found. Start a hunt first.");
        if (completionMode) {
            window.location.href = "huntsPage.html";
        }
        return;
    }

    const playerName = getCookie("playerName") || "";

    // Fetch without limit first to find user's position, so then the player can see himself
    const url = `https://codecyprus.org/th/api/leaderboard?session=${encodeURIComponent(sessionId)}&sorted=${sorted}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            alert("Error fetching leaderboard: " + (data.errorMessages || "Unknown error"));
            if (completionMode) {
                window.location.href = "huntsPage.html";
            }
            return;
        }

        const leaderboard = data.leaderboard || [];
        const myPosition = findMinePosition(data, playerName);
        const displayList = limit ? leaderboard.slice(0, limit) : leaderboard;
        const myEntry = leaderboard[myPosition - 1];
        const inTopList = myPosition > 0 && myPosition <= displayList.length;

        let html = "<h2>Leaderboard</h2>";
        if (myPosition > 0) {
            html += `<p class="your-position">Your position: ${myPosition}</p>`;
        }
        html += "<ol></ol>";
        leaderboardContainer.innerHTML = html;
        const list = leaderboardContainer.querySelector("ol");

        displayList.forEach((entry, index) => {
            const li = document.createElement("li");
            const isCurrentPlayer = playerName && String(entry.player).toLowerCase() === String(playerName).toLowerCase();
            if (isCurrentPlayer) {
                li.className = "leaderboard-entry--you";
            }
            li.innerHTML = `${index + 1}. <b>${entry.player}</b> — ${entry.score} points${isCurrentPlayer ? " (you)" : ""}`;
            list.appendChild(li);
        });

        // If user is not in top list, add them at the end so they can see themselves
        if (myPosition > 0 && !inTopList && myEntry) {
            const li = document.createElement("li");
            li.className = "leaderboard-entry--you";
            li.innerHTML = `${myPosition}. <b>${myEntry.player}</b> — ${myEntry.score} points (you)`;
            list.appendChild(li);
        }

        if (completionMode) {
            leaderboardContainer.innerHTML += `<button type="button" class="appButton" onclick="startAgain()">Start Again!</button>`;
        }

        leaderboardContainer.style.display = "block";
        if (gameContainer && !completionMode) {
            gameContainer.style.display = "none";
        }
    } catch (err) {
        console.error("Network error while fetching leaderboard:", err);
        alert("Network issue! Please try again.");
        if (completionMode) {
            window.location.href = "huntsPage.html";
        }
    }
}

// Backwards compatibility if something else calls the old name
function getLeaderBoard(sessionID) {
    sessionStorage.setItem("session", sessionID);
    return showLeaderboard(true, 10, false);
}