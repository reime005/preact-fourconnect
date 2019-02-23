import FourConnectListener from "./FourConnectListener";

export const joinGame = async (
  fourConnectListener: FourConnectListener,
  gameId?: number | null,
) => {
  try {
    if (!gameId) {
      gameId = await fourConnectListener.callMethod("getOpenGameId");
    }

    await fourConnectListener.cacheSend("joinGame", gameId);
  } catch (e) {
    console.warn(e);
  }
};
