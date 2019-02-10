import FourConnectListener from "./FourConnectListener";

export const withdraw = (
  fourConnectListener: FourConnectListener,
  gameId: number,
) => {
  try {
    fourConnectListener.cacheSend("withdraw", gameId);
  } catch (e) {
    console.warn(e);
  }
};
