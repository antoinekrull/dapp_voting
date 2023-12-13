pragma solidity ^0.8.0;

contract Voting {

    // Define the structure of a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store candidates
    mapping(uint => Candidate) public candidates;

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Contract owner
    address public owner;

    // Voting phase control
    uint public votingStartTime;
    uint public votingDuration; // in seconds
	

    // Number of candidates
    uint public candidatesCount;

    // Constructor
    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
        addCandidate("Joe Biden");
        addCandidate("Donald Trump");
    }	

    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Set voting start time and duration
    function setVotingPhase(uint _start, uint _duration) public onlyOwner {
        votingStartTime = _start;
        votingDuration = _duration;
    }

    // Private function to add candidate
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Public function to vote
    function vote(uint _candidateId) public {
        require(block.timestamp >= votingStartTime && block.timestamp <= votingStartTime + votingDuration, "Voting is not active");
        require(!voters[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    // Get vote count for a candidate
    function getVoteCount(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");
        return candidates[_candidateId].voteCount;
    }
}
