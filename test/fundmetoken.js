var FundMe = artifacts.require("./FundMe.sol");
var FundMeToken = artifacts.require("./FundMeToken.sol");

contract('FundMeToken', function(accounts) {

  it("creates a token named FMT", function() {
    return FundMe.deployed().then(function(instance) {
      instance.token().then(function(token) {
        fmt = FundMeToken.at(token);
        fmt.symbol().then(function(symbol) {
          assert.equal(symbol, "FMT", "Symbol is not correct");
        });
      });
    });
  });

  it("is owned by the FundMe contract", function() {
    return FundMe.deployed().then(function(instance) {
      instance.token().then(function(token) {
        fmt = FundMeToken.at(token);
        fmt.owner().then(function(owner) {
          assert.equal(owner, instance.address, "The token owner is not the FundMe contract");
        });
      });
    });
  });

});
