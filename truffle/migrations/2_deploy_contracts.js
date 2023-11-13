
var FootballAuctions = artifacts.require("./FootballAuctions.sol");
var NFTPlayer = artifacts.require("./NFTPlayer.sol");

module.exports = function(deployer) {
  deployer.deploy(FootballAuctions);
  deployer.deploy(NFTPlayer);
};
