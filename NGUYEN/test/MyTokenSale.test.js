var MyToken = artifacts.require("MyToken.sol"); // lấy contract MyToken
var MyTokenSale = artifacts.require("MyTokenSale.sol"); // lấy contract MyTokenSale
var KycContract = artifacts.require("KycContract.sol"); // lấy contract KycContract
require('dotenv').config({path: '../.env'}); // khai báo sử dụng thư viện env

const chai = require("./setup_chai.js"); // khai báo sử dụng setup_chai.js
const BN = web3.utils.BN; // lấy thư viện chai BN ra
const expect = chai.expect;

contract("MyTokenSale test", async (accounts) => {
    const [deployerAccount, anotherAccount] = accounts; // lấy ra 2 acc để test trường hợp chuyển token qua lại giữa 2 acc với nhau

    // test trường hợp khi deploy contract thì toàn bộ token khởi tạo ban đầu KHÔNG nằm trong tài khoản của người deploy
    it("All tokens should be empty in first account", async () => {
        let instance = await MyToken.deployed(); // deploy contract và lấy instance ra
        expect(await instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(new BN(0)); // check xem số dư của deployerAccount có bằng 0 hay không
    });

    // test trường hợp tất cả token được khởi tạo ban đầu sẽ nằm trong SC TokenSale
    it("all tokens should be in the TokenSale SC by default", async () => {
        let instance = await MyToken.deployed(); // deploy contract và lấy instance ra
        let totalSupply = await instance.totalSupply(); // lấy tổng cung ra
        let balanceOfTokenSaleSC = await instance.balanceOf(MyTokenSale.address); // lấy ra số dư của SC MyTokenSale
        await expect(balanceOfTokenSaleSC).to.be.a.bignumber.equal(totalSupply); // check xem số dư của SC MyTokenSale có bằng tổng số token được tạo hay không

    });
    
    // check xem có thể thực hiện được việc mua token khi acc chưa có trong whitelist hay k
    it("can't possible to buy one token if you're not in whitelist", async () => {
        let instance = await MyToken.deployed(); // deploy contract và lấy instance ra
        let tokenSaleInstance = await MyTokenSale.deployed(); // deploy contract và lấy instance ra
        let balanceBefore = await instance.balanceOf.call(anotherAccount); // lấy ra số dư của anotherAccount
        
        await expect(tokenSaleInstance.sendTransaction({from: anotherAccount, value: web3.utils.toWei("1", "wei")})).to.be.rejected; // chuyển 1 token từ SC MyTokenSale cho anotherAccount
        await expect(balanceBefore).to.be.bignumber.equal(await instance.balanceOf.call(anotherAccount)); // check xem số dư của anotherAccount sau khi chuyển có bằng trước khi chuyển hay k. nếu = thì ok
    });
    
    // check xem có thể thực hiện việc mua token bằng cách gửi ETH vào SC được hay k
    it("should be possible to buy one token by simply sending ether to the SC after adding to whitelist", async () => {
        let instance = await MyToken.deployed(); // deploy contract và lấy instance ra
        let tokenSaleInstance = await MyTokenSale.deployed(); // deploy contract và lấy instance ra
        let balanceBefore = await instance.balanceOf.call(anotherAccount); // lấy ra số dư của anotherAccount
        let kycContractInstance = await KycContract.deployed(); // deploy contract và lấy instance ra
        await kycContractInstance.setKyc(anotherAccount);

        await expect(tokenSaleInstance.sendTransaction({from: anotherAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled; // chuyển 1 token từ SC MyTokenSale cho anotherAccount
        await expect(balanceBefore + 1).to.be.bignumber.equal(await instance.balanceOf.call(anotherAccount)); // check xem số dư của anotherAccount sau khi chuyển có bằng trước khi chuyển +1 hay k
    });
})