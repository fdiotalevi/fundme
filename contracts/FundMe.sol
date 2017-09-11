pragma solidity ^0.4.11;

import './openzeppelin/ownership/Ownable.sol';
import './FundMeToken.sol';

contract FundMe is Ownable {

  uint256 public raised;
  address public owner;
  bool public isOpen;
  mapping(address => uint256) private contributions;
  address[] private contributors;
  FundMeToken public token;
  uint256 public initialTokenPriceInWei;

  struct Conversion {
    uint tokens;
    uint rest;
  }

  function FundMe() {
    isOpen = false;
    owner = msg.sender;
    token = new FundMeToken();
    initialTokenPriceInWei = 10000000000000000; //0.01 eth
  }

  function open() onlyOwner {
    require(!isOpen);
    isOpen = true;
  }

  function convert(uint256 weiAmount) internal returns(Conversion) {
    uint256 tokens = weiAmount / initialTokenPriceInWei;
    uint256 rest = weiAmount % initialTokenPriceInWei;
    return Conversion({tokens: tokens, rest: rest});
  }

  function contribute() payable {
    require(isOpen);

    if (raised + msg.value > raised) {  //TODO overflow check, can replace with SafeMath
      raised += msg.value;
      contributors.push(msg.sender);
      contributions[msg.sender] += msg.value;
      Conversion memory conversion = convert(msg.value);
      if (conversion.tokens > 0) {
        token.mint(msg.sender, conversion.tokens);
      }
      if (conversion.rest > 0) {
        msg.sender.transfer(conversion.rest);
      }
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
