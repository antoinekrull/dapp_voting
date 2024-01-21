import Web3 from "web3";
import contractInfo from "../build/contracts/Voting.json";

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

const contractAddress = contractInfo.networks["5777"].address;
const contractABI = contractInfo.abi;
const votingContract = new web3.eth.Contract(contractABI, contractAddress);

export async function getAllCandidates() {
  try {
    const candidates = await votingContract.methods.getAllCandidates().call();
    console.log(candidates);
    return candidates.map((candidate) => ({
      name: candidate.name,
      voteCount: parseInt(candidate.voteCount),
    }));
  } catch (error) {
    console.error("Error fetching candidates: ", error);
  }
}

export async function initializeCandidates() {
  const candidates = await getAllCandidates();
  const candidateContainer = document.getElementById("candidates");
  candidateContainer.innerHTML = ""; // Clear existing content

  candidates.forEach((candidate) => {
    const candidateDiv = document.createElement("div");
    candidateDiv.className = "candidate";
    candidateDiv.innerText = candidate.name;
    candidateDiv.onclick = () => showSelection(candidate.name);
    candidateContainer.appendChild(candidateDiv);
  });

  updateChart(candidates);
}

function showSelection(selectedCandidate) {
  getAllCandidates().then((candidates) => {
    updateChart(candidates, selectedCandidate);
  });
}

function updateChart(candidates, selectedCandidate) {
  var chartContainer = document.getElementById("chart");
  chartContainer.innerHTML = ""; // Clear existing content

  //TODO: scale chart
  candidates.forEach((candidate) => {
    var bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = voteCount * 10 + "px"; // Adjust height based on vote count
    bar.title = `${candidate.name}: ${candidate.voteCount} votes`;
    chartContainer.appendChild(bar);
  });

  var winner = determineWinner(candidates);
  var winnerElement = document.getElementById("winner");
  winnerElement.innerHTML = "Winner: " + winner.name;
}

function determineWinner(candidates) {
  return candidates.reduce(
    (max, candidate) => (candidate.voteCount > max.voteCount ? candidate : max),
    candidates[0]
  );
}

window.onload = initializeCandidates;
