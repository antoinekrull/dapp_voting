// import Web3 from 'web';

function submitForm() {
    var address = document.getElementById("address").value;
    var errorMessageElement = document.getElementById("error-message");
    if(!isValidBlockchainAddress(address)){
        errorMessageElement.innerHTML = "Eingabe ist keine gültige Blockchain-Adresse.";
        errorMessageElement.style.display = "block"; // Zeige die Fehlermeldung an
        return;
    }
    window.location.href = '../voting/index.html';
    console.log("address: " + address);
}

function isValidBlockchainAddress(address) {
    // eth address consists of 40 hexadecimal signs
    const ethAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;

    return ethAddressRegex.test(address);
}