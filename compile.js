const path = require("path");
const fs = require("fs");
const solc = require("solc");

const exchangeEther = path.resolve(__dirname, "contracts", "ExchangeEther.sol");
const source = fs.readFileSync(exchangeEther, "utf8");

var input = {
  language: "Solidity",
  sources: {
    "test.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));
var contract = output.contracts["test.sol"].ExchangeEther;
var bytecode = contract.evm.bytecode.object;
var interface = contract.abi;
module.exports = { interface, bytecode };