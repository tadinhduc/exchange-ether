const Web3 = require("web3");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/aa61582f63684086b5d4548c2a19b5ab"
  )
);

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

const networkDiv = document.getElementById("network");
const chainIdDiv = document.getElementById("chainId");
const accountsDiv = document.getElementById("accounts");
const balanceDiv = document.getElementById("balance");

const onboardButton = document.getElementById("connectButton");

// Send Eth Section
const sendButton = document.getElementById("sendButton");
const sendButton2eth = document.getElementById("sendButton2eth");
const sendButton3eth = document.getElementById("sendButton3eth");

const initialize = async () => {
  let accounts = [];

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  const onClickConnect = async () => {
    try {
      const newAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      handleNewAccounts(newAccounts);
    } catch (error) {
      console.error(error);
    }
  };

  onboardButton.onclick = onClickConnect;

  function handleNewAccounts(newAccounts) {
    accounts = newAccounts;
    console.log(accounts);
    accountsDiv.innerHTML = accounts;
    updateButtons();
  }
  const updateButtons = () => {
    if (!isMetaMaskInstalled()) {
      onboardButton.innerText = "Click here to install MetaMask!";
      onboardButton.disabled = false;
    } else if (isMetaMaskConnected()) {
      onboardButton.innerText = "Connected";
      onboardButton.disabled = true;
    } else {
      onboardButton.innerText = "Connect";
      onboardButton.onclick = onClickConnect;
      onboardButton.disabled = false;
    }
  };

  function handleNewChain(chainId) {
    chainIdDiv.innerHTML = chainId;
  }

  function handleNewNetwork(networkId) {
    networkDiv.innerHTML = networkId;
  }

  async function getNetworkAndChainId() {
    try {
      const chainId = await ethereum.request({
        method: "eth_chainId",
      });
      handleNewChain(chainId);

      const networkId = await ethereum.request({
        method: "net_version",
      });
      handleNewNetwork(networkId);
    } catch (err) {
      console.error(err);
    }
  }

  if (isMetaMaskInstalled()) {
    ethereum.autoRefreshOnNetworkChange = false;
    getNetworkAndChainId();
    ethereum.on("chainChanged", handleNewChain);
    ethereum.on("networkChanged", handleNewNetwork);
    ethereum.on("accountsChanged", handleNewAccounts);
    try {
      const newAccounts = await ethereum.request({
        method: "eth_accounts",
      });
      handleNewAccounts(newAccounts);
    } catch (err) {
      console.error("Error on init when getting accounts", err);
    }
  }

  //Sending Ethereum to an address
  sendButton.addEventListener("click", () => {
    console.log(document.getElementById("receiverAddress").value);
    if (document.getElementById("receiverAddress").value === "") {
      alert("Enter your testnet account address ");
      return;
    }
    sendTransaction(numberToHex(0.001));
  });

  sendButton2eth.addEventListener("click", () => {
    if (document.getElementById("receiverAddress").value === "") {
      alert("Enter your testnet account address ");
      return;
    }
    sendTransaction(numberToHex(1));
  });

  sendButton3eth.addEventListener("click", () => {
    if (document.getElementById("receiverAddress").value === "") {
      alert("Enter your testnet account address ");
      return;
    }
    sendTransaction(numberToHex(3));
  });

  function numberToHex(number) {
    const wei = web3.utils.toWei(number.toString(), "ether");
    return web3.utils.numberToHex(wei.toString());
  }

  function sendTransaction(amount) {
    ethereum
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            // to: "0xe615f4699E04c8b957DAf79E80f2289281020cbb",
            to: document.getElementById("receiverAddress").value,
            value: amount,
            gas: "21000",
            gasPrice: "20000000000",
          },
        ],
      })
      .then((txHash) => {
        alert("Transaction successfully");
        console.log(txHash);
      })
      .catch((error) => {
        alert("Transaction failure: " + error);
        console.error;
      });
  }

  setInterval(function () {
    console.log(1111);
  }, 30000);

  let balance = await web3.eth.getBalance(accounts[0]);
  console.log("balance", balance);
  balanceDiv.innerHTML = web3.utils.fromWei(balance);
};

window.addEventListener("DOMContentLoaded", initialize);
