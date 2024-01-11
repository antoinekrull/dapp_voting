// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.5.2;

import "./MockOracle.sol";

contract Voting {


    MockOracle public oracle;



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
    mapping(bytes32 => bool) public votedKeys;



    // Contract owner
    address public owner;

    // Voting phase control
    uint public votingStartTime;
    uint public votingDuration; // in seconds
    bool private isVotingActive; // Private variable to track voting status
    uint public time; // test UNIX timestamp
	

    // Number of candidates
    uint public candidatesCount;

    // Constructor
    constructor(address oracleAddress) public{

        oracle = MockOracle(oracleAddress);
        owner = msg.sender; // Set the contract deployer as the owner
        addCandidate("Joe Biden");
        addCandidate("Donald Trump");
        time = block.timestamp;
    }	

    // Modifier to restrict access to owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function getKey() public view returns (bytes32) {
        return oracle.generateKeyUsingAddress(msg.sender);
    }

    // Set voting start time and duration
    function setVotingPhase(uint _start, uint _duration) public onlyOwner {
        require(!isVotingActive, "Voting is already active");
        votingStartTime = _start;
        votingDuration = _duration;
        isVotingActive = true;
    }

    // Private function to add candidate
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Public function to vote
    function vote(uint _candidateId, bytes32 key) public {
        require(block.timestamp >= votingStartTime && block.timestamp <= votingStartTime + votingDuration, "Voting is not active");
        //require(!voters[msg.sender], "Already voted");
        require(!votedKeys[key], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        //voters[msg.sender] = true;
        votedKeys[key] = true;
        candidates[_candidateId].voteCount++;
    }

    // Get vote count for a candidate
    function getVoteCount(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");
        return candidates[_candidateId].voteCount;
    }
    // Function to get the start and end times of the voting phase as uint values (UNIX timestamp in seconds)
    function getVotingPhase() public view returns (uint startTime, uint endTime) {
        require(isVotingActive, "Voting is not active");

        startTime = votingStartTime;
        endTime = votingStartTime + votingDuration;
        return (startTime, endTime);
}

}

