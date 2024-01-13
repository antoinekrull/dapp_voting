import Web3 from 'web3';
import contractInfo from '../../contracts/Voting.sol';
const web3 = new Web3(Web3.givenProvider);

// address of the contract
const contractAddress = contractInfo.networks['5777'].address;

// TODO: thats not what the IDE proposed me, try .contractAbi
const contractABI = contractInfo.abi;

// Get a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

var electionsStarted = false; // Variable to track whether elections have started

function startElections() {
    electionsStarted = true;
    document.getElementById("election-status").style.display = "none"; // Hide the status message
}

function showSelection(selectedCandidate) {
    console.log(selectedCandidate)
    if (!electionsStarted) {
        return; // Do nothing if elections haven't started
    }
    var auswahlElement = document.getElementById("selection");
    auswahlElement.innerHTML = "Selected candidate: " + selectedCandidate;
}

// be sure that the candidates element exist when method is called onload!
async function displayCandidates() {
    try {
        const result = await contract.methods.getCandidateNames().call();

        const displayElement = document.getElementById('candidates');

        result.forEach(element => {
            const div = document.createElement('div');
            div.innerHTML = `${element}`;

            displayElement.appendChild(div);

            div.addEventListener('click', function() {
                showSelection(element);
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
