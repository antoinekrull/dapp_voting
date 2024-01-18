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
    showCountdown(5 * 60 + 30);
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

export function showCountdown(duration) {
    const countdownElement = document.createElement('div');
    countdownElement.id = 'countdown';
    document.body.appendChild(countdownElement);

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    function updateCountdown() {
        const currentTime = Date.now();
        const remainingTime = Math.max(0, endTime - currentTime);
        const minutes = Math.floor(remainingTime / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // puts time in min:sec format
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        countdownElement.innerText = `Countdown: ${formattedTime}`;

        if (remainingTime > 0) {
            requestAnimationFrame(updateCountdown);
        } else {
            countdownElement.innerText = 'Elections are over!';
        }
    }

    updateCountdown();
}

export const isOwner = async () => {
    const ownerAddress = await contract.methods.getCandidateNames().call();
}
