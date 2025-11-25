//Load high scores from localStorage
function loadHighScores() 
{
    const scoreContainer = document.querySelector("#scoreContainer");

    //Remove previous rows (except header)
    scoreContainer.querySelectorAll(".scoreRow:not(.header)").forEach(row => row.remove());

    const difficulty = document.querySelector("#difficulty").value;
    const allScores = JSON.parse(localStorage.getItem("highScores")) || [];
    
    //Filter scores by difficulty if stored with difficulty property
    const scores = allScores.filter(s => !s.difficulty || s.difficulty === difficulty);
    
    //Display no score message if there are no scores
    if (scores.length === 0) 
    {
        // Show "No scores to display"
        const row = document.createElement("div");
        row.classList.add("scoreRow", "no-score");

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("name");
        nameSpan.textContent = "No scores to display";

        const scoreSpan = document.createElement("span");

        row.appendChild(nameSpan);
        row.appendChild(scoreSpan);
        scoreContainer.appendChild(row);
        return; //Exit function
    }

    //Sort in descending order
    scores.sort((a, b) => b.score - a.score);

    //Limit to top 10 list of scores
    const topScores = scores.slice(0, 10);

    //Append rows
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

//Load scores initially
loadHighScores();

//Reload scores when difficulty changes
document.querySelector("#difficulty").addEventListener("change", loadHighScores);