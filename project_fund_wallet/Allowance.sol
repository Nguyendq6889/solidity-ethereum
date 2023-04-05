// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
// import "./Owner.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

// contract FundWallet is Owner {
contract Allowance is Ownable {
    using SafeMath for uint; // chỉ sử dụng kiểu dữ liệu uint

    event AllowanceChange(address indexed _forWho, address indexed _byWhom, uint _oldAmount, uint _newAmount);
    mapping(address => uint) public allowance;

    // thêm 1 người vào, đưa cho họ 1 số tiền và ủy quyền cho họ (họ có thể cầm số tiền đó chuyển cho 1 người khác)
    function addAllowance(address _who, uint _amount) public onlyOwner {
        emit AllowanceChange(_who, msg.sender, allowance[_who], _amount);
        // allowance[_who] = _amount;
        allowance[_who] = allowance[_who].add(_amount);
    }

    // check xem người gọi hàm này có phải là chủ sở hữu SC (người deploy SC) không
    function isOwner() internal view returns(bool) {
        return owner() == msg.sender;
    }

    modifier ownerOrWhoIsAllowed(uint _amount) {
        require(isOwner() || allowance[msg.sender] >= _amount, "Ban khong duoc phep...");
        _;
        // yêu cầu phải là chủ sở hữu (người deploy SC) hoặc người được ủy quyền
    }

    // trừ đi số tiền sắp chuyển
    function reduceAllowance(address _who, uint _amount) internal ownerOrWhoIsAllowed(_amount) {
        emit AllowanceChange(_who, msg.sender, allowance[_who], allowance[_who] - _amount);
        // allowance[_who] -= _amount;
        allowance[_who] = allowance[_who].sub(_amount);
    }

    function renounceOwnership() public view override onlyOwner {
        revert("Can't renounce ownership...");
    }
} 