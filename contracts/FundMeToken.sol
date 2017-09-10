pragma solidity ^0.4.11;

import "./openzeppelin/token/MintableToken.sol";


/**
 * @title FundMeToken
 */
contract FundMeToken is MintableToken {

  string public constant name = "FundMeToken";
  string public constant symbol = "FMT";
  uint8 public constant decimals = 0;

  uint256 public constant INITIAL_SUPPLY = 10000;

  /**
   * @dev Contructor that gives msg.sender all of existing tokens.
   */
  function FundMeToken() {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}
