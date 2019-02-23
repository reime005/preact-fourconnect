import FourConnectListener from "./FourConnectListener";

export const makeMoveAndClaimVictory = async (
  fourConnectListener: FourConnectListener,
  gameId: number,
  moveToMake: number,
  claim: number[] = [],
) => {
  try {
    console.warn(gameId);
    console.warn(moveToMake);
    console.warn(claim);

    return await fourConnectListener.cacheSend("makeMoveAndClaimVictory", gameId, moveToMake, claim.sort((a, b) => b - a),
    {});
  } catch (e) {
    console.warn(e);
  }
};
