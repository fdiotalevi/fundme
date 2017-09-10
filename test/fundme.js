var FundMe = artifacts.require("./FundMe.sol");

contract('FundMe', function(accounts) {

  it("should should start the fund raising with 0 balance", function() {
    return FundMe.deployed().then(function(instance) {
      instance.raised.call().then(function(raised) {
        assert.equal(raised.valueOf(), 0, "fund raising should start at 0");
      });
    });
  });

  it("should not be open when it is instantiated", function() {
    return FundMe.deployed().then(function(instance) {
      instance.isOpen.call().then(function(open) {
        assert.equal(open.valueOf(), false, "fund raising is not closed");
      });
    });
  });

  it("should not accept a contribution when closed", function() {
    return FundMe.deployed().then(function(instance) {
      return instance.contribute.sendTransaction({from: accounts[1], value: 100}).then(function(result) {
        assert(false, "should have thrown an exception");
      }).catch(function(error) {
        assert(error.toString().indexOf(" invalid opcode") > 0, "incorrect error message");
      });
    });
  });

  it("can be opened only by the owner", function() {
    return FundMe.deployed().then(function(instance) {
      return instance.open.sendTransaction({from: web3.eth.accounts[1]}).then(function(result) {
        assert(false, "should have thrown an exception");
      }).catch(function(error) {
        assert(error.toString().indexOf(" invalid opcode") > 0, "incorrect error message");
      });
    });
  });


});


contract('FundMe', function(accounts) {

  it("can be opened", function() {
    return FundMe.deployed().then(function(instance) {
      instance.open.sendTransaction().then(function() {
        instance.isOpen.call().then(function(open) {
          assert.equal(open.valueOf(), true, "fund raising is not open");
        });
      });
    });
  });

  it("cannot be opened again", function() {
    return FundMe.deployed().then(function(instance) {
      return instance.open.sendTransaction().then(function(result) {
        assert(false, "should have thrown an exception");
      }).catch(function(error) {
        assert(error.toString().indexOf(" invalid opcode") > 0, "incorrect error message");
      });
    });
  });

  it("should accept and count a valid contribution", function() {
    return FundMe.deployed().then(function(instance) {
      instance.contribute.sendTransaction({from: accounts[1], value: web3.toWei(0.1, 'ether')}).then(function() {
        instance.raised.call().then(function(raised) {
          assert.equal(raised.valueOf(), web3.toWei(0.1, 'ether'), "fund raising should have a balance of 0.1 eth");
        });
      });
    });
  });

  it("can be closed only by the owner", function() {
    return FundMe.deployed().then(function(instance) {
      return instance.close.sendTransaction({from: web3.eth.accounts[1]}).then(function(result) {
        assert(false, "should have thrown an exception");
      }).catch(function(error) {
        assert(error.toString().indexOf(" invalid opcode") > 0, "incorrect error message");
      });
    });
  });

  it("can be closed", function() {
    var initialBalance = web3.eth.getBalance(web3.eth.accounts[0]);
    return FundMe.deployed().then(function(instance) {
      return instance.close.sendTransaction().then(function(result) {
        assert(web3.eth.getBalance(web3.eth.accounts[0]) > initialBalance, "balance is incorrect");
      });
    });
  });

});

contract('FundMe', function(accounts) {

  it("can be refunded only by the owner", function() {
    return FundMe.deployed().then(function(instance) {
      instance.open.sendTransaction().then(function() {
        instance.refundContributors.sendTransaction({from: web3.eth.accounts[1]}).then(function(result) {
          assert(false, "should have thrown an exception");
        }).catch(function(error) {
          assert(error.toString().indexOf(" invalid opcode") > 0, "incorrect error message");
        });
      });
    });
  });

  it("can refund contributors", function() {
    var balanceAcc1 = 0;
    var fundMe;
    return FundMe.deployed().then(function(fundMe) {
      fundMe.contribute.sendTransaction({from: accounts[3], value: web3.toWei(0.2, 'ether')}).then(function() {
        balanceAcc1 = web3.eth.getBalance(accounts[3]).toNumber();
        fundMe.refundContributors.sendTransaction().then(function() {
          assert(web3.eth.getBalance(accounts[3]).toNumber() == balanceAcc1 + ((Number) (web3.toWei(0.2, 'ether'))), "Amount has not been refunded");
        });
      });
    });
  });
});
