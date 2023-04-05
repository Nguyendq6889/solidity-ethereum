// import React, { Component } from "react";
// import KycContract from "./contracts/KycContract.json";
// import MyToken from "./contracts/MyToken.json";
// import MyTokenSale from "./contracts/MyTokenSale.json";
// import getWeb3 from "./getWeb3";
// import "./App.css";

// class App extends Component {
//   state = { loaded: false, kycAddress: "0x235....", tokenSaleAddress: null, userToken: 0 };

//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       this.web3 = await getWeb3();

//       // Use web3 to get the user's accounts.
//       this.accounts = await this.web3.eth.getAccounts();

//       // Get the contract instance.
//       this.networkId = await this.web3.eth.net.getId();

//       this.tokenInstance = new this.web3.eth.Contract(
//         MyToken.abi,
//         MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
//       );

//       this.tokenSaleInstance = new this.web3.eth.Contract(
//         MyTokenSale.abi,
//         MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
//       );

//       this.kycContractInstance = new this.web3.eth.Contract(
//         KycContract.abi,
//         KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
//       );

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.

//       this.listenToTokenTransfer();

//       this.setState(
//           { loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address },
//           this.updateUserToken
//       );

//       let totalInTokenSale = await this.tokenInstance.methods.balanceOf(this.state.tokenSaleAddress).call();
//       console.log('totalInTokenSale before',totalInTokenSale); 

//       totalInTokenSale = this.convertToDisplayToken(totalInTokenSale);
//       console.log('totalInTokenSale after',totalInTokenSale); 
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

//   handleInputChange = (event) => {
//     const target = event.target;
//     // console.log('target',target);
//     const value = target.value;
//     const name = target.name;
//     this.setState({
//       [name]: value,
//     })
//   }

//   handleKycWhitelisting = async () => {
//     await this.kycContractInstance.methods
//       .setKyc(this.state.kycAddress)
//       .send({ from: this.accounts[0] });
//     alert("KYC for: " + this.state.kycAddress + " is successful");
//   }

//   buyToken = async () => {
//     await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({
//       from: this.accounts[0],
//       value: this.web3.utils.toWei("1", "ether"),
//     });

//     let totalInTokenSale = await this.tokenInstance.methods.balanceOf(this.state.tokenSaleAddress).call();
//     console.log('totalInTokenSale after buytoken',this.convertToDisplayToken(totalInTokenSale)); 
//   }

//   updateUserToken = async () => {
//     let userToken = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    
//     userToken = this.convertToDisplayToken(userToken);
//     this.setState({ userToken: userToken });
//   }

//   listenToTokenTransfer = () => {
//     this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserToken);
//   }

//   convertToDisplayToken(amount){
//     return this.web3.utils.fromWei(amount,"ether");
//   }

//   render() {
//     if (!this.state.loaded) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//         <h1>MoonStar Token Sale</h1>
//         <p>Get your token for today!!!!</p>
//         <h2>KYC Whitelisting</h2>
//         Address to allow:{""}
//         <input
//           type="text"
//           name="kycAddress"
//           value={this.state.kycAddress}
//           onChange={this.handleInputChange}
//         />
//         <button type="button" onClick={this.handleKycWhitelisting}>
//           Add to Whitelist
//         </button>
//         <h2>
//           Buy Tokens
//         </h2>
//         <p>
//           If you want to buy tokens, send Wei to this address: {""}
//           {this.state.tokenSaleAddress}
//         </p>
//         <p>You currently have: {this.state.userToken} MSR Tokens</p>
//         <button type="button" onClick={this.buyToken}>
//           Buy Tokens
//         </button>
//       </div>
//     );
//   }
// }

// export default App;



import React, { Component } from "react";
import KycContract from "./contracts/KycContract.json";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "0x235....", tokenSaleAddress: null, userToken: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycContractInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.listenToTokenTransfer();

      this.setState(
        { loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address },
        this.updateUserToken,
      );

      let totalInTokenSale = await this.tokenInstance.methods.balanceOf(this.state.tokenSaleAddress).call();
      console.log('totalInTokenSale before',totalInTokenSale); 

      totalInTokenSale = this.convertToDisplayToken(totalInTokenSale);
      console.log('totalInTokenSale after',totalInTokenSale); 
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    // console('target',target);
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    })
  }

  handleKycWhitelisting = async () => {
    await this.kycContractInstance.methods
      .setKyc(this.state.kycAddress)
      .send({ from: this.accounts[0] });
    alert("KYC for: " + this.state.kycAddress + "is successful");
  }

  buyToken = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({
      from: this.accounts[0],
      value: this.web3.utils.toWei("0.5", "ether"),
    })

    let totalInTokenSale = await this.tokenInstance.methods.balanceOf(this.state.tokenSaleAddress).call();
    console.log('totalInTokenSale after buytoken',this.convertToDisplayToken(totalInTokenSale)); 
  }

  updateUserToken = async () => {
    let userToken = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    
    userToken = this.convertToDisplayToken(userToken);
    this.setState({ userToken: userToken });
  }

  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserToken);
  }

  convertToDisplayToken(amount){
    return this.web3.utils.fromWei(amount,"ether");
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>MoonStar Token Sale</h1>
        <p>Get your token for today!!!!</p>
        <h2>KYC Whitelisting</h2>
        Address to allow:{""}
        <input
          type="text"
          name="kycAddress"
          value={this.state.kycAddress}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleKycWhitelisting}>
          Add to Whitelist
        </button>
        <h2>
          Buy Tokens
        </h2>
        <p>
          If you want to buy tokens, send Wei to this address: {""}
          {this.state.tokenSaleAddress}
        </p>
        <p>You currently have: {this.state.userToken} MSR Tokens</p>
        <button type="button" onClick={this.buyToken}>
          Buy Tokens
        </button>
      </div>
    );
  }
}

export default App;
