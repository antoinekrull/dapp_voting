// 2_deploy_voting.js
const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  // Deploy the Voting contract
  deployer.deploy(Voting);
};
