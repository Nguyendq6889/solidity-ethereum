var MyToken = artifacts.require("MyToken.sol"); // lấy contract MyToken
require('dotenv').config({path: '../.env'}); // khai báo sử dụng thư viện env

const chai = require("./setup_chai.js"); // khai báo sử dụng setup_chai.js
const BN = web3.utils.BN; // lấy thư viện chai BN ra
const expect = chai.expect;

contract("MyToken test", async (accounts) => {
    const [deployerAccount, anotherAccount] = accounts; // lấy ra 2 acc để test trường hợp chuyển token qua lại giữa 2 acc với nhau

    // console.log("accounts", accounts); // in ra list acc
    // console.log("deployerAccount", deployerAccount); // in ra acc deploy SC
    // console.log("anotherAccount", anotherAccount); // in ra acc được nhận token

    // Hook function. code trong hàm này sẽ được chạy trước, sau đó mới chạy đến các hàm it() bên dưới
    beforeEach(async() => {
        this.myToken = await MyToken.new(process.env.INITIAL_TOKENS); // tạo giả lập 1 lượng token mà k cần deploy
    })

    // test trường hợp khi deploy contract thì toàn bộ token khởi tạo ban đầu sẽ nằm trong tài khoản của người deploy
    it("All tokens should be in first account", async () => {
        // let instance = await MyToken.deployed(); // deploy contract và lấy instance ra
        let instance = await this.myToken; // lấy instance ra
        let totalSupply = await instance.totalSupply(); // lấy tổng cung ra
        expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(totalSupply); // check xem số dư của accounts[0] có bằng totalSupply hay không
    });

    // test chức năng chuyển token giữa các acc
    it("is possible to send tokens between accounts", async () => {
        const sendToken = 1;
        // let instance = await MyToken.deployed(); // deploy contract và lấy instance ra
        let instance = await this.myToken; // lấy instance ra
        let totalSupply = await instance.totalSupply(); // lấy tổng cung ra
        
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply); // check xem số dư của deployerAccount có bằng totalSupply hay không
        await expect(instance.transfer(anotherAccount, sendToken)).to.eventually.be.fulfilled; // chuyển token cho anotherAccount, fulfilled nghĩa là mong đợi chức năng này được thực hiện thành công
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken))); // check xem số dư của deployerAccount sau khi chuyển đã bị trừ đi chưa
        await expect(instance.balanceOf(anotherAccount)).to.eventually.be.a.bignumber.equal(new BN(sendToken)); // check xem số dư của anotherAccount đã được cộng token chưa
    });
    
    // check xem có thể chuyển nhiều hơn lượng token hiện có hay k
    it("is not possible to send more tokens than available in total", async () => {
        // let instance = await MyToken.deployed(); // deploy contract và lấy instance ra
        let instance = await this.myToken; // lấy instance ra
        let balanceOfDeployer = await instance.balanceOf(deployerAccount); // lấy ra số dư của deployerAccount
        
        await expect(instance.transfer(anotherAccount, new BN(balanceOfDeployer + 1))).to.eventually.be.rejected; // chuyển cho anotherAccount số lượng token mà deployerAccount hiện có cộng thêm 1, rejected nghĩa là mong đợi chức năng này bị từ chối, k thực hiện được
        await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer); // check xem số dư của deployerAccount có bằng lúc đầu hay k. nếu bằng thì ok
        // await expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer.sub(new BN(1))); // check xem số dư của deployerAccount có bị trừ đi 1 hay k. nếu k thì ok
    });
})