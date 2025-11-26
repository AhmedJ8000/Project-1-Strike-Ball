// Select the dropdown
const difficultySelect = document.querySelector("#difficulty");

// Load saved difficulty
const savedDifficulty = localStorage.getItem("selectedDifficulty") || "normal";
difficultySelect.value = savedDifficulty; // Sets the dropdown to saved value
console.log("Current difficulty:", savedDifficulty);

// When the selection changes
difficultySelect.addEventListener("change", () => {
    const selectedDifficulty = difficultySelect.value; // "easy", "normal", or "hard"
    console.log("Selected difficulty:", selectedDifficulty);

    // Save it to localStorage
    localStorage.setItem("selectedDifficulty", selectedDifficulty);
});
