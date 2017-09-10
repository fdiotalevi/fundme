pragma solidity ^0.4.4;

contract FundMe {

  uint256 public raised;
  address public owner;
  bool public isOpen;
  mapping(address => uint256) private contributions;
  address[] private contributors;

  modifier onlyOwner {
      require(msg.sender == owner);
      _;
  }

  function FundMe() {
    isOpen = false;
    owner = msg.sender;
  }

  function open() onlyOwner {
    require(!isOpen);
    isOpen = true;
  }

  function contribute() payable {
    require(isOpen);

    if (raised + msg.value > raised) {
      raised += msg.value;
      contributors.push(msg.sender);
      contributions[msg.sender] += msg.value;
      return;
    }

    revert();
  }

  function refundContributors() onlyOwner {
    require(isOpen);
    isOpen = false;
    for (uint i = 0; i < contributors.length; i++) {
        var contributor = contributors[i];
        var amount = contributions[contributor];
        raised -= amount;
        contributions[contributor] = 0;
        contributor.transfer(amount);
    }
  }

  function close() onlyOwner {        //distributed eth to beneficiary
    require(isOpen);
    isOpen = false;
    if (raised > 0) {
        owner.transfer(raised);
    }
  }

}
