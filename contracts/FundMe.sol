pragma solidity ^0.4.4;

contract FundMe {

  uint256 public raised;
  address public owner;
  bool public isOpen;

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
      return;
    }

    revert();
  }

  function close() onlyOwner {        //distributed eth to beneficiary
    require(isOpen);
    isOpen = false;
    if (raised > 0) {
        owner.transfer(raised);
    }
  }

}
