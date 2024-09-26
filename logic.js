// logic.js

const playersData = {
  group1: {
      players: ['Player 1.1', 'Player 1.2', 'Player 1.3', 'Player 1.4'],
      matches: []
  },
  group2: {
      players: ['Player 2.1', 'Player 2.2', 'Player 2.3', 'Player 2.4'],
      matches: []
  },
  group3: {
      players: ['Player 3.1', 'Player 3.2', 'Player 3.3', 'Player 3.4'],
      matches: []
  },
  group4: {
      players: ['Player 4.1', 'Player 4.2', 'Player 4.3', 'Player 4.4'],
      matches: []
  }
};

function checkMatchAlreadyExists(groupId, player1, player2) {
  return playersData[groupId].matches.some(match => 
      (match.player1 === player1 && match.player2 === player2) || 
      (match.player1 === player2 && match.player2 === player1)
  );
}

function submitMatchResult(groupId) {
  const player1Select = document.getElementById(`player1${groupId}`);
  const player2Select = document.getElementById(`player2${groupId}`);
  const restPointsInput = document.getElementById(`restPointsgroup${groupId}`);
  const winnerRadioButtons = document.querySelectorAll(`input[name="winner${groupId}"]`);

  const player1 = player1Select.value;
  const player2 = player2Select.value;
  const restPoints = parseInt(restPointsInput.value);
  
  const winnerRadio = Array.from(winnerRadioButtons).find(radio => radio.checked);
  const winner = winnerRadio ? winnerRadio.id.replace(`winner${groupId}`, '') : null;

  if (checkMatchAlreadyExists(groupId, player1, player2)) {
      alert("Match between these players has already been submitted.");
      return;
  }

  if (winner && player1 && player2 && !isNaN(restPoints) && restPoints >= 0) {
      // Update players data and matches
      playersData[groupId].matches.push({ player1, player2, winner, restPoints });
      updateGroupTable(groupId);
      resetForm(groupId);
  } else {
      alert("Please fill in all fields correctly.");
  }
}

function resetForm(groupId) {
  document.getElementById(`player1${groupId}`).value = "";
  document.getElementById(`player2${groupId}`).value = "";
  
  const winnerRadio = document.querySelector(`input[name="winner${groupId}"]:checked`);
  if (winnerRadio) {
      winnerRadio.checked = false;
  }

  document.getElementById(`restPointsgroup${groupId}`).value = "";
}

function updateGroupTable(groupId) {
  const tableBody = document.querySelector(`#${groupId}Table tbody`);
  tableBody.innerHTML = '';

  // Calculate wins and losses
  const playerStats = {};
  playersData[groupId].players.forEach(player => {
      playerStats[player] = { matchesPlayed: 0, wins: 0, losses: 0, totalRestPoints: 0 };
  });

  playersData[groupId].matches.forEach(match => {
      playerStats[match.player1].matchesPlayed++;
      playerStats[match.player2].matchesPlayed++;
      
      if (match.winner === match.player1) {
          playerStats[match.player1].wins++;
          playerStats[match.player2].losses++;
      } else {
          playerStats[match.player2].wins++;
          playerStats[match.player1].losses++;
      }
      playerStats[match.player2].totalRestPoints += match.restPoints;
  });

  // Populate table
  Object.entries(playerStats).forEach(([player, stats]) => {
      const row = tableBody.insertRow();
      row.insertCell(0).textContent = player;
      row.insertCell(1).textContent = stats.matchesPlayed;
      row.insertCell(2).textContent = stats.wins;
      row.insertCell(3).textContent = stats.losses;
      row.insertCell(4).textContent = stats.totalRestPoints;
  });
}

// Event Listeners for Submit Buttons
document.getElementById("submitBtngroup1").onclick = () => submitMatchResult('group1');
document.getElementById("submitBtngroup2").onclick = () => submitMatchResult('group2');
document.getElementById("submitBtngroup3").onclick = () => submitMatchResult('group3');
document.getElementById("submitBtngroup4").onclick = () => submitMatchResult('group4');

// Populate player select dropdowns
function populatePlayerSelects() {
  Object.keys(playersData).forEach(groupId => {
      const player1Select = document.getElementById(`player1${groupId}`);
      const player2Select = document.getElementById(`player2${groupId}`);
      
      playersData[groupId].players.forEach(player => {
          const option1 = new Option(player, player);
          const option2 = new Option(player, player);
          player1Select.add(option1);
          player2Select.add(option2);
      });
  });
}

window.onload = populatePlayerSelects;

// Tab switching functionality
function openTab(evt, groupName) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = "none";  
  }
  const tabLinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
  }
  document.getElementById(groupName).style.display = "block";  
  evt.currentTarget.className += " active";
}
