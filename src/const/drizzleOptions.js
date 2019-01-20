import FourConnect from "../../solidity/build/contracts/FourConnect.json";

const drizzleOptions = {
  contracts: [FourConnect],
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  }
};

export default drizzleOptions;
