import Web3 from 'web3';
import contractInfo from '../build/contracts/Voting.json';
let userAccount;
let votedCandidate;
const durationInMinutes = 1;
ethereum.request({ method: 'eth_requestAccounts' })
  .then(accounts => {
    // Handle the user's accounts
    userAccount = accounts[0];
  })
  .catch(error => {
    // Handle error
    console.error(error);
  });
const web3 = new Web3(window.ethereum);
// address of the contract
const contractAddress = contractInfo.networks['5777'].address;

// TODO: thats not what the IDE proposed me, try .contractAbi
const contractABI = contractInfo.abi;
// Get a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);
var electionsStarted = false; // Variable to track whether elections have started

export async function startElections() {
    const startTimestamp = Math.floor(Date.now() / 1000); // current time in seconds
    const endTimestamp = startTimestamp + (durationInMinutes * 60);

    electionsStarted = true;
    contract.methods.setVotingPhase(startTimestamp, endTimestamp).send({ from: userAccount });
    document.getElementById("election-status").style.display = "none"; // Hide the status message
    showCountdown(durationInMinutes * 60);
}

function showSelection(selectedCandidate) {
    if (!electionsStarted) {
        return; // Do nothing if elections haven't started
    }
    var auswahlElement = document.getElementById("selection");
    auswahlElement.innerHTML = "Selected candidate: " + selectedCandidate;
    votedCandidate = selectedCandidate;
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

async function showCountdown(duration) {
    // this function does way more then just showing the coundown, needs rework if time is left
    const countdownElement = document.createElement('div');
    countdownElement.id = 'countdown';
    document.body.appendChild(countdownElement);

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    async function updateCountdown() {
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
            await voteForCandidate(votedCandidate);
            window.location.href = './results.html';
        }
    }

    updateCountdown();
}

async function voteForCandidate(votedCandidate){
    const usersKey = await getUsersKey();
    await contract.methods.vote(votedCandidate, usersKey).send({from: userAccount});
}

async function getUsersKey(){
    const userKey = await contract.methods.getUsersKey().call({from: userAccount});
    return userKey;
}

export async function checkIsVotingActive(){
    const isVotingActive = await contract.methods.getIsVotingActive().call();
    if (isVotingActive){
        showCountdown(durationInMinutes * 60);
        electionsStarted = true;
    }
}
