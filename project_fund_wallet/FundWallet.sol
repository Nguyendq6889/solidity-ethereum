// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./Allowance.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract FundWallet is Allowance {
    event MoneySent(address indexed _to, uint _amount);
    event MoneyReceive(address indexed _from, uint _amount);

    // chuyển tiền từ SC đến ví bất kì (ví chuyển chịu phí gas)
    function withDrawMoney(address payable _to, uint _amount) public ownerOrWhoIsAllowed(_amount) {
        if(!isOwner()) {
            reduceAllowance(msg.sender, _amount);
        }
        emit MoneySent(_to, _amount);
        _to.transfer(_amount);
    }

    receive() external payable {
        emit MoneyReceive(msg.sender, msg.value);
    }
} 