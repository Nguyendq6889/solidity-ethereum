var MyToken = artifacts.require("MyToken.sol"); // get contract MyToken
var MyTokenSale = artifacts.require("MyTokenSale.sol"); // get contract MyTokenSale
var KycContract = artifacts.require("KycContract.sol"); // get contract KycContract

require('dotenv').config({path: '../.env'}); // khai báo sử dụng thư viện env
console.log(process.env);

module.exports = async function(deployer) {
  // console.log(deployer); // để xem khi test thì chương trình chạy ntn
  let addr = await web3.eth.getAccounts(); // get list acc
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS); // deploy contract MyToken
  await deployer.deploy(KycContract); // deploy contract KycContract
  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, KycContract.address); // deploy contract MyTokenSale

  let tokenInstance = await MyToken.deployed(); // lấy instance ra
  // let balanceOfMTSBefore = await tokenInstance.balanceOf(MyTokenSale.address); // lấy ra số dư của contract MyTokenSale trước khi chuyển
  // let balanceOfDeployerBefore = await tokenInstance.balanceOf(addr[0]); // lấy ra số dư của deployer trước khi chuyển
  let totalSupply = await tokenInstance.totalSupply();
  console.log('totalSupply', totalSupply);
  // console.log("---------- Before transfer ----------"); // để xem khi test thì chương trình chạy ntn
  // console.log('balanceOfMTSBefore', balanceOfMTSBefore.toString()); // để xem khi test thì chương trình chạy ntn
  // console.log('balanceOfDeployerBefore', balanceOfDeployerBefore.toString()); // để xem khi test thì chương trình chạy ntn
  // console.log('------------------------------'); // để xem khi test thì chương trình chạy ntn

  await tokenInstance.transfer(MyTokenSale.address, totalSupply); // chuyển hết token vào contract MyTokenSale
  // let balanceOfMTSAfter = await tokenInstance.balanceOf(MyTokenSale.address); // lấy ra số dư của contract MyTokenSale sau khi chuyển
  // let balanceOfDeployerAfter = await tokenInstance.balanceOf(addr[0]); // lấy ra số dư của deployer sau khi chuyển

  // console.log("---------- After transfer ----------"); // để xem khi test thì chương trình chạy ntn
  // console.log('balanceOfMTSAfter', balanceOfMTSAfter.toString()); // để xem khi test thì chương trình chạy ntn
  // console.log('balanceOfDeployerAfter', balanceOfDeployerAfter.toString()); // để xem khi test thì chương trình chạy ntn
  // console.log('------------------------------'); // để xem khi test thì chương trình chạy ntn

};
