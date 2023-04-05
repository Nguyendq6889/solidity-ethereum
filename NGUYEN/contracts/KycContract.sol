// contracts/MyToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable {
    mapping(address => bool) allowed;

    function setKyc(address _add) public onlyOwner {
        allowed[_add] = true;
    } // thêm 1 acc vào SC

    function revokeKyc(address _add) public onlyOwner {
        allowed[_add] = false;
    } // xóa 1 acc khỏi SC

    function kycCompleted(address _add) public view returns(bool) {
        return allowed[_add];
    } // kiểm tra xem acc này có trong SC không
}