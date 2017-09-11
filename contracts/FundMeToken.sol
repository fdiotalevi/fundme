pragma solidity ^0.4.11;

import "./openzeppelin/token/MintableToken.sol";


/**
 * @title FundMeToken
 */
contract FundMeToken is MintableToken {

  string public constant name = "FundMeToken";
  string public constant symbol = "FMT";
  uint8 public constant decimals = 0;

  function FundMeToken() {
  }

}
