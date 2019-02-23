import Web3 from "web3/types";
import { FourConnectListener } from "./FourConnectListener";

export const newGame = async (
  fourConnectListener: FourConnectListener,
  ownAccount: string,
  createGameBidEth: string,
  opponentsAddress?: string,
) => {
  try {
    const web3: Web3 = fourConnectListener.getWeb3();

    if (opponentsAddress) {
      return await fourConnectListener.cacheSend(
        "newRestrictedGame",
        opponentsAddress,
        {
          from: ownAccount,
          value: web3.utils.toWei(createGameBidEth || "0", "ether"),
        },
      );
    } else {
      await fourConnectListener.cacheSend("newGame", {
        from: ownAccount,
        value: web3.utils.toWei(createGameBidEth || "0", "ether"),
      });
    }
  } catch (e) {
    console.warn(e);
  }
};
