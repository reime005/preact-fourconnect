import FourConnectListener from "./FourConnectListener";

export const giveUp = (
  fourConnectListener: FourConnectListener,
  gameId: number | null,
) => {
  try {
    fourConnectListener.cacheSend("giveUp", gameId);
  } catch (e) {
    console.warn(e);
  }
};
