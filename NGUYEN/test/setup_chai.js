"use strict"

var chai = require("chai"); // lấy thư viện chai ra
const BN = web3.utils.BN; // lấy thư viện chai BN ra
const chaiBN = require("chai-bn")(BN); // config thư viện chai BN
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

module.exports = chai;