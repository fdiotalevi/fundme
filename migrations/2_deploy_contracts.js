var FundMe = artifacts.require("./FundMe.sol");

module.exports = function(deployer) {
  deployer.deploy(FundMe);
};
