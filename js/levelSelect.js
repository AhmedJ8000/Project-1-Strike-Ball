const buttons = document.querySelectorAll(".level-btn");
let chosenLevel = 1;

// highlighting the selected button
buttons.forEach(btn => 
{
    btn.addEventListener("click", () => 
        {
        buttons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        chosenLevel = parseInt(btn.dataset.level);
    });
});

// Start button
document.querySelector("#startLevel").addEventListener("click", () => 
{
    localStorage.setItem("selectedLevel", chosenLevel);
    window.location.href = "game.html";
});
