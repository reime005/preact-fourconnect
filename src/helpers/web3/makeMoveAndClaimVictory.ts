import FourConnectListener from "./FourConnectListener";

export const makeMoveAndClaimVictory = async (
  fourConnectListener: FourConnectListener,
  gameId: number,
  moveToMake: number,
  claim: number[]
) => {
  try {
    return await fourConnectListener.cacheSend("makeMoveAndClaimVictory", gameId, moveToMake, claim);
  } catch (e) {
    console.warn(e);
  }
};
