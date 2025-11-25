//Get all buttons
const buttons = document.querySelectorAll(".level-btn");
let chosenLevel;
let startBtn = document.querySelector("#startLevel");


//Disable start button initially
startBtn.disabled = true;

//Highlighting the selected button
buttons.forEach(btn => 
{
    btn.addEventListener("click", () => 
    {
        buttons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        chosenLevel = parseInt(btn.dataset.level);
        console.log("Selected Level: " + chosenLevel);
        //Enable the start button now that a level is selected
        startBtn.disabled = false;
    });
});

//Start button
startBtn.addEventListener("click", () => 
{
    if (chosenLevel == null)
    {
        console.log("No level is selected!");
        return;
    }
    else
    {
    localStorage.setItem("selectedLevel", chosenLevel);
    window.location.href = "game.html";
    }
});
