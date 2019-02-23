import { BigNumber } from "bignumber.js";

export const getEtherInGame = (one: any, two: any, web3: any): any => {
  return web3.utils && web3.utils.fromWei(new BigNumber(one).plus(new BigNumber(two)).toString(), "ether") || null;
};
