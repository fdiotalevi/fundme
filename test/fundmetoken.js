var FundMe = artifacts.require("./FundMe.sol");
var FundMeToken = artifacts.require("./FundMeToken.sol");

contract('FundMeToken', function(accounts) {

  it("creates a token named FMT", function() {
    return FundMe.deployed().then(function(instance) {
      instance.token().then(function(token) {
        var fmt = FundMeToken.at(token);
        fmt.symbol().then(function(symbol) {
          assert.equal(symbol, "FMT", "Symbol is not correct");
        });
      });
    });
  });

  it("is owned by the FundMe contract", function() {
    return FundMe.deployed().then(function(instance) {
      instance.token().then(function(token) {
        var fmt = FundMeToken.at(token);
        fmt.owner().then(function(owner) {
          assert.equal(owner, instance.address, "The token owner is not the FundMe contract");
        });
      });
    });
  });

  it("doesn't accept mint requests from other than the owner", function() {
    return FundMe.deployed().then(function(instance) {
      instance.token().then(function(token) {
        var fmt = FundMeToken.at(token);
        fmt.mint('0x00001', 1).then(function(result) {
          assert(false, "should have thrown an exception");
        }).catch(function(error) {
          assert(error.toString().indexOf(" invalid opcode") > 0, "incorrect error message");
        });;
      });
    });
  });

});


contract('FundMe', function(accounts) {

  it("assign 1 token for 0.01eth contibution", function() {
    return FundMe.deployed().then(function(instance) {
      instance.open().then(function() {
        instance.contribute.sendTransaction({from: accounts[1], value: web3.toWei(0.01, 'ether')}).then(function() {
          instance.token().then(function(token) {
            var fmt = FundMeToken.at(token);
            fmt.balanceOf(accounts[1]).then(function(result) {
              assert.equal(result.toNumber(), 1, "Incorrect balance");
            })
          });
        });
      });
    });
  });

  it("assign 2 tokens for 0.02eth contibution", function() {
    return FundMe.deployed().then(function(instance) {
      instance.contribute.sendTransaction({from: accounts[2], value: web3.toWei(0.02, 'ether')}).then(function() {
        instance.token().then(function(token) {
          var fmt = FundMeToken.at(token);
          fmt.balanceOf(accounts[2]).then(function(result) {
            assert.equal(result.toNumber(), 2, "Incorrect balance");
          })
        });
      });
    });
  });

  //TODO find a way to check the rest

});
