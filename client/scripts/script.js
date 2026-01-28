// Game State
// Store the current game mode
// CPU = player vs computer
// pvp= player vs player
let aMode = "cpu";

// In Pvp mode player 1 picks first
// We temporarily store player 1's choice here
// Until Player 2 makes their choice
let aPendingChoice = "";

// Track Player 1 total wins
let aP1Score = 0;

// Track Player 2 / CPU total wins
let aP2Score = 0;

// Tracks total ties
let aTies = 0;

// API Configuration
// Change this to our API endpoint that returns a random move as a string 
// Example  options your api could return rock paper scissors
// Create A variable to store the API URL
const aApiUrl = "https://backendrspgt-gndcgra5c6d2f8au.westus3-01.azurewebsites.net/RPS/ComputerRnd";

// ================= DOM REFERENCES =================

// Gets the CPU mode button from the HTML
const aBtnModeCpu = document.getElementById("btnModeCpu");

// Gets the PVP mode button from the HTML
const aBtnModePvp = document.getElementById("btnModePvp");

// Gets the text element that explains the current mode
const aModeHint = document.getElementById("modeHint");

// Gets the element that displays Player 1's choice
const aP1PickEl = document.getElementById("p1Pick");

// Gets the element that displays Player 2's choice
const aP2PickEl = document.getElementById("p2Pick");

// Gets the element that displays the result of the round
const aRoundResultEl = document.getElementById("roundResult");

// Gets the entire Player 2 section (hidden in CPU mode)
const aP2Section = document.getElementById("p2Section");

// Gets the hint text shown to Player 2
const aP2Hint = document.getElementById("p2Hint");

// Gets the element that displays Player 1's score
const aP1ScoreEl = document.getElementById("p1Score");

// Gets the element that displays Player 2's score
const aP2ScoreEl = document.getElementById("p2Score");

// Gets the element that displays tie count
const aTiesEl = document.getElementById("ties");

// Gets the "Play Again" button
const aBtnPlayAgain = document.getElementById("btnPlayAgain");

// Gets the "Reset Game" button
const aBtnReset = document.getElementById("btnReset");

// Player 1 choice buttons
const aBtnP1Rock = document.getElementById("btnP1Rock");
const aBtnP1Paper = document.getElementById("btnP1Paper");
const aBtnP1Scissors = document.getElementById("btnP1Scissors");

// Player 2 choice buttons (only used in PVP mode)
const aBtnP2Rock = document.getElementById("btnP2Rock");
const aBtnP2Paper = document.getElementById("btnP2Paper");
const aBtnP2Scissors = document.getElementById("btnP2Scissors");

// ================= HELPER FUNCTIONS =================

// Function switches the game mode between CPU and PVP
// This function resets round state and updates the UI
function aSetMode(aNewMode) {
  aMode = aNewMode;

  // Clear any stored player 1 choice
  aPendingChoice = "";

  // Reset the UI display
  aClearPicksUI();

  // If CPU mode is selected
  if (aMode === "cpu") {
    // Highlight the CPU mode button
    aBtnModeCpu.classList.add("active");

    // Remove highlight from PVP mode button
    aBtnModePvp.classList.remove("active");

    // Hide player 2 controls
    aP2Section.style.display = "none";

    // Update the instructions
    aModeHint.textContent = "You are playing against the CPU.";
  } else {
    // Highlight the PVP mode button
    aBtnModePvp.classList.add("active");

    // Remove highlight from CPU mode button
    aBtnModeCpu.classList.remove("active");

    // Show player 2 controls
    aP2Section.style.display = "block";

    // Update the instructions
    aModeHint.textContent = "Player 1, make your choice.";
    aP2Hint.textContent = "Waiting for Player 1...";
  }
}

// Clears the visual display of the current round
function aClearPicksUI() {
  // Reset player 1 pick display
  aP1PickEl.textContent = "-";

  // Reset player 2 pick display
  aP2PickEl.textContent = "-";

  // Reset round result display
  aRoundResultEl.textContent = "Make your move!";
}

// Updates the score display in the UI
function aUpdateScoreUI() {
  // Update Player 1 score display
  aP1ScoreEl.textContent = aP1Score;

  // Update Player 2 / CPU score display
  aP2ScoreEl.textContent = aP2Score;

  // Update ties display
  aTiesEl.textContent = aTies;
}

// Generates a random choice for the CPU
function aRandomCpuChoice() {
  let aNum = Math.floor(Math.random() * 3);

  // Map number to a choice
  if (aNum === 0) return "rock";
  if (aNum === 1) return "paper";
  return "scissors";
}
//Get the CPU choice from the API.
// Expects the API to return "rock", "paper", or "scissors"
// 1 plain text return either 
// 1 plain text: "rock"
// 1 Json {"choice":"rock"}
function aGetCpuChoiceFromApi() {
  return fetch(aApiUrl)
    .then(function (response) {
      return response.text();
    }).then(function (text) {
      return text.trim().toLocaleLowerCase();
    });
  }
// Determines the winner of a round
function aGetWinner(aP1, aP2) {
  // Check for tie
  if (aP1 === aP2) return "tie";

  // Player 1 win conditions
  if (aP1 === "rock" && aP2 === "scissors") return "p1";
  if (aP1 === "paper" && aP2 === "rock") return "p1";
  if (aP1 === "scissors" && aP2 === "paper") return "p1";

  // Otherwise Player 2 wins
  return "p2";
}

// Plays one round of the game
function aPlayRound(aP1Choice, aP2Choice) {
  // Display player choices in the UI
  aP1PickEl.textContent = aP1Choice;
  aP2PickEl.textContent = aP2Choice;

  // Determine winner
  let aWinner = aGetWinner(aP1Choice, aP2Choice);

  // Handle tie case
  if (aWinner === "tie") {
    aTies = aTies + 1;
    aRoundResultEl.textContent = "It's a tie!";
  }
  // Handle player 1 win case
  else if (aWinner === "p1") {
    aP1Score = aP1Score + 1;
    aRoundResultEl.textContent = "Player 1 wins!";
  }
  // Handle player 2 / CPU win case
  else {
    aP2Score = aP2Score + 1;

    if (aMode === "cpu") {
      aRoundResultEl.textContent = "CPU wins!";
    } else {
      aRoundResultEl.textContent = "Player 2 wins!";
    }
  }

  // Refresh score display
  aUpdateScoreUI();
}

// Handles Player 1 picking rock, paper, or scissors
function aHandleP1Pick(aChoice) {
  // If the game is in CPU mode
  if (aMode === "cpu") {
    let aCpuChoice = aRandomCpuChoice();
    aPlayRound(aChoice, aCpuChoice);
    return;
  }
  
  if (aMode === "cpu") {
    aP1PickEl.textContent = aChoice;
    aP2PickEl.textContent = "...";
    aRoundResultEl.textContent = "CPU is making a choice...";
    
    aGetCpuChoiceFromApi().then(function (cpuChoice) {
      aPlayRound(aChoice, cpuChoice);
      return;
    });
    
  }
  // ----- PVP MODE LOGIC -----

  // Store Player 1's choice temporarily
  aPendingChoice = aChoice;

  // Show Player 1's choice
  aP1PickEl.textContent = aChoice;

  // Hide Player 2's choice
  aP2PickEl.textContent = "?";

  // Update instructions
  aRoundResultEl.textContent = "Player 2, make your pick!";
  aP2Hint.textContent = "Your turn!";
}

// Handles Player 2 picking rock, paper, or scissors
function aHandleP2Pick(aChoice) {
  // If Player 1 has not picked yet, do nothing
  if (aPendingChoice === "") {
    return;
  }

  // Play the round
  aPlayRound(aPendingChoice, aChoice);

  // Clear Player 1's stored choice
  aPendingChoice = "";

  // Reset hint text
  if (aMode === "pvp") {
    aP2Hint.textContent = "Waiting for Player 1...";
  }
}

// ================= EVENT LISTENERS =================

// Mode buttons
aBtnModeCpu.addEventListener("click", function () {
  aSetMode("cpu");
});

aBtnModePvp.addEventListener("click", function () {
  aSetMode("pvp");
});

// Player 1 buttons
aBtnP1Rock.addEventListener("click", function () {
  aHandleP1Pick("rock");
});

aBtnP1Paper.addEventListener("click", function () {
  aHandleP1Pick("paper");
});

aBtnP1Scissors.addEventListener("click", function () {
  aHandleP1Pick("scissors");
});

// Player 2 buttons (PVP only)
aBtnP2Rock.addEventListener("click", function () {
  aHandleP2Pick("rock");
});

aBtnP2Paper.addEventListener("click", function () {
  aHandleP2Pick("paper");
});

aBtnP2Scissors.addEventListener("click", function () {
  aHandleP2Pick("scissors");
});

// Play Again button (clears picks only)
aBtnPlayAgain.addEventListener("click", function () {
  aPendingChoice = "";
  aClearPicksUI();

  if (aMode === "pvp") {
    aP2Hint.textContent = "Waiting for Player 1...";
  }
});

// Reset Game button (resets scores and picks)
aBtnReset.addEventListener("click", function () {
  aP1Score = 0;
  aP2Score = 0;
  aTies = 0;
  aPendingChoice = "";

  aClearPicksUI();
  aUpdateScoreUI();

  if (aMode === "pvp") {
    aP2Hint.textContent = "Waiting for Player 1...";
  }
});
