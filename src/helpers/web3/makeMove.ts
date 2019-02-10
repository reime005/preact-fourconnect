import { FourConnectListener } from "./FourConnectListener";

export const makeMove = async (
  fourConnectListener: FourConnectListener,
  gameId: number,
  position: number
) => {
  try {
    return await fourConnectListener.cacheSend(
      "makeMove",
      gameId,
      position,
      {}
    );
  } catch (e) {
    console.warn(e);
  }
};
