// SPDX-License-Identifier: CC-BY-NC-SA-4.0
pragma solidity 0.5.2;

pragma experimental ABIEncoderV2; // Enable the new ABI encoder

import "./MockOracle.sol";

contract Voting {


    MockOracle public oracle;
    event IsVotingActive(bool isVotingActive);



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
    bool private isVotingActive = false; // Private variable to track voting status
    uint public time; // test UNIX timestamp
	

    // Number of candidates
    uint public candidatesCount = 0;

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

    function getCallerAddress() public view returns (address) {
        return msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
    
    function getKey() public view returns (bytes32) {
        return oracle.generateKeyUsingAddress(msg.sender);
    }

    function assignUserStateKey() public {

    }

    // safes the state key
    function safeStateKey(bytes32 stateKey) public {
        //TODO: needs a relation between state key and user address
        //TODO: is a check if the key is already taken necessary? the probability is near zero
        votedKeys[stateKey] = false;
        voters[msg.sender] = false;
    }

    function getCandidateNames() public view returns (string[] memory){
        //uint candidateCount = 2; //hard-coded for test purpose

        string[] memory candidateNames = new string[](candidatesCount);

        for (uint i = 0; i < candidatesCount; i++) {
            candidateNames[i] = candidates[i].name;
        }

        return candidateNames;
    }

    // Set voting start time and duration (TODO: make callable only by contract owner)
    function setVotingPhase(uint _start, uint _duration) public {
        // is not callable twice when a require is used, therefore checked with if
        if(!isVotingActive){
            votingStartTime = _start;
            votingDuration = _duration;
            isVotingActive = true;
            emit IsVotingActive(true);
        }
    }

    // Private function to add candidate
    function addCandidate(string memory _name) private {
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
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


    function getAllCandidates() public view returns (Candidate[] memory) {

        // TODO: add constraint and make sure to show a message on results page when voting is still active
        //require(isVotingActive, "Voting is still active.");
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        
        for (uint i = 0; i < candidatesCount; i++) {
            Candidate storage candidate = candidates[i];
            allCandidates[i] = candidate;
        }

        return allCandidates;
    }

}

