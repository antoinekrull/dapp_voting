function auswahlAnzeigen(ausgewaehlterKandidat) {
    // The vote count data (you can replace this with actual vote count logic)
    var voteCounts = {
        "Kandidat 1": 30,
        "Kandidat 2": 20,
        "Kandidat 3": 15
    };
    // Update the chart based on the selected candidate
    updateChart(ausgewaehlterKandidat, voteCounts);
}
function updateChart(selectedCandidate, voteCounts) {
    // Display the chart
    var chartContainer = document.getElementById("chart");
    chartContainer.innerHTML = "";
    for(var candidate in voteCounts){
        var bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = voteCounts[candidate] * 5 + "px"; // Adjust the multiplier for better visualization
        bar.style.backgroundColor = candidate === selectedCandidate ? "#4caf50" : "#2196F3"; // Highlight selected candidate
        chartContainer.appendChild(bar);
    }
    // Determine the winner
    var winner = determineWinner(voteCounts);
    var winnerElement = document.getElementById("winner");
    winnerElement.innerHTML = "Winner: " + winner;
}
function determineWinner(voteCounts) {
    var maxVotes = 0;
    var winner = "";
    for(var candidate in voteCounts)if (voteCounts[candidate] > maxVotes) {
        maxVotes = voteCounts[candidate];
        winner = candidate;
    }
    return winner;
}

//# sourceMappingURL=results.db39c869.js.map
