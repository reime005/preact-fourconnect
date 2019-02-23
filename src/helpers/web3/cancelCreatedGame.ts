import FourConnectListener from "./FourConnectListener";

export const cancelCreatedGame = (
  fourConnectListener: FourConnectListener,
  gameId: number | null,
) => {
  try {
    fourConnectListener.cacheSend("cancelCreatedGame", gameId);
  } catch (e) {
    console.warn(e);
  }
};
