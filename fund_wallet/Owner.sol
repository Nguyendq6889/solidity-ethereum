// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
// pragma solidity ^0.5.13;

contract Owner {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ban khong duoc phep"); // check xem người gọi hàm này phải là người deploy SC thì mới cho tạo token mới
        _; // thực thi những lệnh trong hàm mà sử dụng modifier khi thỏa điều kiện ở trên
    }
}
