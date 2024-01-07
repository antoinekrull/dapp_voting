// 2_deploy_voting.js
/*
const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  // Deploy the Voting contract
  deployer.deploy(Voting);
};

*/
const MockOracle = artifacts.require("MockOracle");
const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  deployer.deploy(MockOracle).then(function () {
    return deployer.deploy(Voting, MockOracle.address);
  });
};
