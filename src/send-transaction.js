module.exports = async (web3, from, to, value) => {
  // using the event emitter
  web3.eth
    .sendTransaction({
      from: from,
      to: to,
      value: value,
    });
};
