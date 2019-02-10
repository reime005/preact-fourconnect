import FourConnectListener from "./FourConnectListener";

export const claimTimeoutVictory = (
  fourConnectListener: FourConnectListener,
  gameId: number,
) => {
  try {
    fourConnectListener.cacheSend("claimTimeoutVictory", gameId);
  } catch (e) {
    console.warn(e);
  }
};
