import Web3 from 'web3';
import contractInfo from '../build/contracts/Voting.json';
const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

// address of the contract
const contractAddress = contractInfo.networks['5777'].address;

// TODO: thats not what the IDE proposed me, try .contractAbi
const contractABI = contractInfo.abi;

// Get a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

var electionsStarted = false; // Variable to track whether elections have started

export function startElections() {
    electionsStarted = true;
    document.getElementById("election-status").style.display = "none"; // Hide the status message
}

function showSelection(selectedCandidate) {
    if (!electionsStarted) {
        return; // Do nothing if elections haven't started
    }
    var auswahlElement = document.getElementById("selection");
    auswahlElement.innerHTML = "Selected candidate: " + selectedCandidate;
}

export const displayCandidates = async () => {
    try {
        const result = await contract.methods.getCandidateNames().call();

        const displayElement = document.getElementById('candidates');

        result.forEach(element => {
            const div = document.createElement('div');
            div.innerHTML = `${element}`;
            div.classList.add('candidate');

            displayElement.appendChild(div);

            div.addEventListener('click', function() {
                showSelection(element);
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export const isOwner = async () => {
    const ownerAddress = await contract.methods.getCandidateNames().call();
}

export const executeKeyProcess = async () => {
    const ownerAddress = await contract.methods.getCandidateNames().call();
}
