//Load high scores from localStorage
function loadHighScores() 
{
    const scoreContainer = document.querySelector("#scoreContainer");

    //Remove previous rows (except header)
    scoreContainer.querySelectorAll(".scoreRow:not(.header)").forEach(row => row.remove());

    //Current dropdown difficulty
    const difficulty = document.querySelector("#difficulty").value;

    //Get all saved scores
    const allScores = JSON.parse(localStorage.getItem("highScores")) || [];

    //Filter scores for this difficulty
    const scores = allScores.filter(s => s.difficulty === difficulty);

    //Check if there are no scores, then no score to display
    if (scores.length === 0) 
    {
        const row = document.createElement("div");
        row.classList.add("scoreRow", "no-score");

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("name");
        nameSpan.textContent = "No scores to display";

        const scoreSpan = document.createElement("span");

        row.appendChild(nameSpan);
        row.appendChild(scoreSpan);
        scoreContainer.appendChild(row);
        return;
    }

    //Sort scores descending
    scores.sort((a, b) => b.score - a.score);

    //Take top 10 scores only
    const topScores = scores.slice(0, 10);

    //Display rows for scores
    topScores.forEach(s => 
    {
        const row = document.createElement("div");
        row.classList.add("scoreRow");

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("name");
        nameSpan.textContent = s.name;

        const scoreSpan = document.createElement("span");
        scoreSpan.classList.add("score");
        scoreSpan.textContent = s.score;

        row.appendChild(nameSpan);
        row.appendChild(scoreSpan);
        scoreContainer.appendChild(row);
    });
}



//Auto-select difficulty of the last played game
window.addEventListener("load", () => {
    const difficultySelect = document.querySelector("#difficulty");

    //Check if the last game stored a difficulty temporarily
    const recentDifficulty = localStorage.getItem("currentScoreDifficulty");

    if (recentDifficulty) 
    {
        //Apply it to dropdown
        difficultySelect.value = recentDifficulty;

        //Remove temporary data so it only affects this load once
        localStorage.removeItem("currentScoreDifficulty");
    }

    //Load the scores for selected difficulty
    loadHighScores();
});

//Reload scores when dropdown changes
document.querySelector("#difficulty").addEventListener("change", loadHighScores);
