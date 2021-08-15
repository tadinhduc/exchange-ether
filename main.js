const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const api = require("./src/api");
const { interface, bytecode } = require("./compile");

const main = async () => {
  const accounts = await web3.eth.getAccounts();
  const ADDRESS = accounts[2];
  const TO = accounts[1];
  const amount = 9999;

  //deploy contract
  const contract = await new web3.eth.Contract(interface)
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: "2000000" });
  console.log("Contract deployed to", contract.options.address);
  
  // sender.methods
  //   .validate(amount)
  //   .send({
  //     from: accounts[0],
  //   })
  //   .on("receipt", (receipt) => {
  //     console.log(receipt);
  //   });

  // send some ether:
  console.log("\nSend some ether: ", amount);
  transfertEther(ADDRESS, TO, amount);

  let fromBalance = await web3.eth.getBalance(ADDRESS);
  let toBalance = await web3.eth.getBalance(TO);

  console.log(`  balance of ${ADDRESS} is ${fromBalance}`);
  console.log(`  balance of ${TO} is ${toBalance}`);
};

transfertEther = async (fromAddress, toAddress, amount) => {
  await web3.eth
    .sendTransaction({
      from: fromAddress,
      to: toAddress,
      value: amount,
      gas: 2000000,
    })
    .then((receipt) => {
      return receipt;
    });
};

main();
