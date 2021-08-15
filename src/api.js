const axios = require('axios');
const { JSDOM } = require('jsdom');

// let url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"

const functions = {
  getEtherPrice: async () => {
    const { data } = await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
    return data.USD;
  },
  getGasPrice: async () => {
    const { data } = await axios.get("https://etherscan.io/gasTracker");
    const dom = new JSDOM(data);
    const { document } = dom.window;
    const averagePrice = document.querySelector("#spanAvgPrice");
    return parseFloat(averagePrice.textContent)
  }
}

module.exports = functions
