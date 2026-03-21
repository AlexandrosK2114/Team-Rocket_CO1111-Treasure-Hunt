async function showLeaderboard({ sorted = true, limit = 10 } = {}) {
    const leaderboardContainer = document.getElementById('leaderboard');
    const gameContainer = document.getElementById('game-container');

    if (!leaderboardContainer) {
        console.error('Missing #leaderboard element in HTML.');
        return;
    }
    if (!gameContainer) {
        console.error('Missing #game-container element in HTML.');
        return;
    }

    const sessionId = getCookie("sessionID") || sessionStorage.getItem("session");
    if (!sessionId) {
        alert("No session found. Start a hunt first.");
        return;
    }

    const url = `https://codecyprus.org/th/api/leaderboard?session=${encodeURIComponent(sessionId)}&sorted=${sorted}&limit=${limit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            alert("Error fetching leaderboard: " + (data.errorMessages || "Unknown error"));
            return;
        }

        leaderboardContainer.innerHTML = `<h2>Leaderboard</h2><ol></ol>`;
        const list = leaderboardContainer.querySelector("ol");

        (data.leaderboard || []).forEach((entry, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<b>${index + 1}. ${entry.player}</b> — ${entry.score} points`;
            list.appendChild(li);
        });

        gameContainer.style.display = "none";
        leaderboardContainer.style.display = "block";
    } catch (err) {
        console.error("Network error while fetching leaderboard:", err);
        alert("Network issue! Please try again.");
    }
}

// Backwards compatibility if something else calls the old name
function getLeaderBoard(sessionID) {
    sessionStorage.setItem("session", sessionID);
    return showLeaderboard({ sorted: true, limit: 10 });
}