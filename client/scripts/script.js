

const aApiUrl =
  "https://backendrspgt-gndcgra5c6d2f8au.westus3-01.azurewebsites.net/RPS/ComputerRnd";

let aMode = "cpu"; //pvp also
let aP1Pick = "";
let aP2Pick = "";

let aP1Score = 0;
let aP2Score = 0;

let aWinTarget = 1;
let aGameOver = false;

// DOM ELEMENTS

// Player 1 buttons
const aBtnP1Rock = document.getElementById("btnP1Rock");
const aBtnP1Paper = document.getElementById("btnP1Paper");
const aBtnP1Scissors = document.getElementById("btnP1Scissors");
const aBtnP1Lizard = document.getElementById("btnP1Lizard");
const aBtnP1Spock = document.getElementById("btnP1Spock");

// Player 2 buttons
const aBtnP2Rock = document.getElementById("btnP2Rock");
const aBtnP2Paper = document.getElementById("btnP2Paper");
const aBtnP2Scissors = document.getElementById("btnP2Scissors");
const aBtnP2Lizard = document.getElementById("btnP2Lizard");
const aBtnP2Spock = document.getElementById("btnP2Spock");

// Mode buttons
const aBtnModeCpu = document.getElementById("btnModeCpu");
const aBtnModePvp = document.getElementById("btnModePvp");

// Match buttons
const aBtnMatch1 = document.getElementById("btnMatch1");
const aBtnMatch3 = document.getElementById("btnMatch3");
const aBtnMatch4 = document.getElementById("btnMatch4");
const aMatchHint = document.getElementById("matchHint");

// UI
const aRoundResultEl = document.getElementById("roundResult");
const aP1ScoreEl = document.getElementById("p1Score");
const aP2ScoreEl = document.getElementById("p2Score");

// MATCH MODE

function aSetMatchMode(aWinsNeeded) {
  aWinTarget = aWinsNeeded;
  aGameOver = false;
  aResetScores();

  aBtnMatch1.classList.remove("active");
  aBtnMatch3.classList.remove("active");
  aBtnMatch4.classList.remove("active");

  if (aWinsNeeded === 1) {
    aBtnMatch1.classList.add("active");
    aMatchHint.textContent = "First to 1 win";
  } else if (aWinsNeeded === 3) {
    aBtnMatch3.classList.add("active");
    aMatchHint.textContent = "First to 3 wins (Best of 5)";
  } else {
    aBtnMatch4.classList.add("active");
    aMatchHint.textContent = "First to 4 wins (Best of 7)";
  }
}

aBtnMatch1.addEventListener("click", () => aSetMatchMode(1));
aBtnMatch3.addEventListener("click", () => aSetMatchMode(3));
aBtnMatch4.addEventListener("click", () => aSetMatchMode(4));

// API fetch I had AI help me with this because it wouldnt accept my api data when i did it the way before.

function aGetCpuChoiceFromApi() {
  return fetch(aApiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("API error");
      return response.json();
    })
    .then((data) => {
      if (typeof data === "string") return data.toLowerCase();
      if (data.choice) return data.choice.toLowerCase();
      throw new Error("Bad data");
    })
    .catch(() => {
      const fallback = ["rock", "paper", "scissors", "lizard", "spock"];
      return fallback[Math.floor(Math.random() * fallback.length)];
    });
}


// GAME LOGIC

function aGetWinner(aP1, aP2) {
  if (aP1 === aP2) return "tie";

  if (aP1 === "scissors" && (aP2 === "paper" || aP2 === "lizard")) return "p1";
  if (aP1 === "rock" && (aP2 === "lizard" || aP2 === "scissors")) return "p1";
  if (aP1 === "paper" && (aP2 === "rock" || aP2 === "spock")) return "p1";
  if (aP1 === "lizard" && (aP2 === "spock" || aP2 === "paper")) return "p1";
  if (aP1 === "spock" && (aP2 === "scissors" || aP2 === "rock")) return "p1";

  return "p2";
}

function aPlayRound() {
  if (aGameOver || !aP1Pick || !aP2Pick) return;

  const aWinner = aGetWinner(aP1Pick, aP2Pick);

  if (aWinner === "p1") {
    aP1Score++;
    aRoundResultEl.textContent = "Player 1 wins the round!";
  } else if (aWinner === "p2") {
    aP2Score++;
    aRoundResultEl.textContent =
      aMode === "cpu" ? "CPU wins the round!" : "Player 2 wins the round!";
  } else {
    aRoundResultEl.textContent = "Tie round!";
  }

  aUpdateScoreUI();

  if (aP1Score === aWinTarget) {
    aRoundResultEl.textContent = "🏆 Player 1 wins the match!";
    aGameOver = true;
  }

  if (aP2Score === aWinTarget) {
    aRoundResultEl.textContent =
      aMode === "cpu"
        ? "🏆 CPU wins the match!"
        : "🏆 Player 2 wins the match!";
    aGameOver = true;
  }

  aP1Pick = "";
  aP2Pick = "";
}

// HANDLERS

function aHandleP1Pick(aPick) {
  if (aGameOver) return;

  aP1Pick = aPick;
  document.getElementById("p1Pick").textContent = aPick;

  if (aMode === "cpu") {
    aRoundResultEl.textContent = "CPU is thinking...";
    aGetCpuChoiceFromApi().then((cpuPick) => {
      aP2Pick = cpuPick;
      document.getElementById("p2Pick").textContent = cpuPick;
      aPlayRound();
    });
  } else {
    aRoundResultEl.textContent = "Player 2, make your choice";
    aEnableP2Buttons(true);
  }
}

function aHandleP2Pick(aPick) {
  if (aGameOver) return;
  if (aMode !== "pvp") return;
  if (!aP1Pick) return;

  aP2Pick = aPick;
  document.getElementById("p2Pick").textContent = aPick;
  aPlayRound();
  aEnableP2Buttons(false);
}

// ENABLE / DISABLE P2 BUTTONS

function aEnableP2Buttons(enable) {
  aBtnP2Rock.disabled = !enable;
  aBtnP2Paper.disabled = !enable;
  aBtnP2Scissors.disabled = !enable;
  aBtnP2Lizard.disabled = !enable;
  aBtnP2Spock.disabled = !enable;
}

// At game start, disable P2 buttons
aEnableP2Buttons(false);

// MODE SWITCH (CPU / PVP)

function aSetMode(newMode) {
  aMode = newMode;
  aGameOver = false;
  aP1Pick = "";
  aP2Pick = "";
  aResetScores();

  if (aMode === "cpu") {
    aBtnModeCpu.classList.add("active");
    aBtnModePvp.classList.remove("active");
    aRoundResultEl.textContent = "You are playing against the CPU.";
  } else {
    aBtnModePvp.classList.add("active");
    aBtnModeCpu.classList.remove("active");
    aRoundResultEl.textContent = "Player 1, make your choice.";
  }

  // disable P2 buttons at mode switch
  aEnableP2Buttons(false);
}

// Mode button clicks
aBtnModeCpu.onclick = () => aSetMode("cpu");
aBtnModePvp.onclick = () => aSetMode("pvp");

// UI HELPERS

function aUpdateScoreUI() {
  aP1ScoreEl.textContent = aP1Score;
  aP2ScoreEl.textContent = aP2Score;
}

function aResetScores() {
  aP1Score = 0;
  aP2Score = 0;
  aUpdateScoreUI();
  aRoundResultEl.textContent = "";
  document.getElementById("p1Pick").textContent = "-";
  document.getElementById("p2Pick").textContent = "-";
}

// BUTTON EVENTS

// Player 1
aBtnP1Rock.onclick = () => aHandleP1Pick("rock");
aBtnP1Paper.onclick = () => aHandleP1Pick("paper");
aBtnP1Scissors.onclick = () => aHandleP1Pick("scissors");
aBtnP1Lizard.onclick = () => aHandleP1Pick("lizard");
aBtnP1Spock.onclick = () => aHandleP1Pick("spock");

// Player 2
aBtnP2Rock.onclick = () => aHandleP2Pick("rock");
aBtnP2Paper.onclick = () => aHandleP2Pick("paper");
aBtnP2Scissors.onclick = () => aHandleP2Pick("scissors");
aBtnP2Lizard.onclick = () => aHandleP2Pick("lizard");
aBtnP2Spock.onclick = () => aHandleP2Pick("spock");

// CLEAR PICKS / RESET BUTTONS

const aBtnPlayAgain = document.getElementById("btnPlayAgain");
const aBtnReset = document.getElementById("btnReset");

aBtnPlayAgain.onclick = () => {
  aP1Pick = "";
  aP2Pick = "";
  aRoundResultEl.textContent = aMode === "cpu" ? "Make a pick. CPU will pick automatically." : "Player 1, make your choice.";
  aEnableP2Buttons(false);
  document.getElementById("p1Pick").textContent = "-";
  document.getElementById("p2Pick").textContent = "-";
};

aBtnReset.onclick = () => {
  aP1Score = 0;
  aP2Score = 0;
  aUpdateScoreUI();

  aP1Pick = "";
  aP2Pick = "";
  document.getElementById("p1Pick").textContent = "-";
  document.getElementById("p2Pick").textContent = "-";

  aRoundResultEl.textContent = "You are playing against the CPU.";

  aSetMode("cpu");
  aSetMatchMode(1);
  aEnableP2Buttons(false);
};
