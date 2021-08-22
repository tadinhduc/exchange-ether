const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const api = require("./src/api");
// var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const { interface, bytecode } = require("./compile");

const main = async () => {
  const accounts = await web3.eth.getAccounts();

  const senderAddress = accounts[2];
  const receiverAddress = accounts[1];
  const amount = "1000000000000000";

  //deploy contract
  const contract = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: "2000000" });
  console.log("Contract deployed to", contract.options.address);

  contract.methods.validate(amount).call((err, res) => {
    if (err) {
      console.log("An error occurred", err);
      return;
    }
    console.log("The amount is validated");
  });

  // send some ether:
  console.log("\nSend some ether: ", web3.utils.fromWei(amount) + "eth");

  const receipt = await web3.eth.sendTransaction({
    from: senderAddress,
    to: receiverAddress,
    value: amount,
    gas: 2000000,
  });

  let fromBalance = await web3.eth.getBalance(senderAddress);
  let toBalance = await web3.eth.getBalance(receiverAddress);
  console.log(
    `balance of ${senderAddress} is ${web3.utils.fromWei(fromBalance)}`
  );
  console.log(
    `balance of ${receiverAddress} is ${web3.utils.fromWei(toBalance)}`
  );
};

main();
