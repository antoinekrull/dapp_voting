var electionsStarted = false; // Variable to track whether elections have started

function startElections() {
    electionsStarted = true;
    document.getElementById("election-status").style.display = "none"; // Hide the status message
}

function auswahlAnzeigen(ausgewaehlterKandidat) {
    console.log(ausgewaehlterKandidat)
    if (!electionsStarted) {
        return; // Do nothing if elections haven't started
    }
    // Die Auswahl in einem Element anzeigen
    var auswahlElement = document.getElementById("auswahl");
    auswahlElement.innerHTML = "Ausgewählter Kandidat: " + ausgewaehlterKandidat;
}
