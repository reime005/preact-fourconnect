
export default async function getGameIdFromLogs(promise, eventName = "logGameInitialized") {
    const result = await promise;
    let id = -1;

    //TODO: should be optimized
    await result.logs.map(log => {
        if (log.event === eventName) {
            id = log.args.gameId.toNumber();
        }
    });

    if (id != -1) {
        return id;
    }

    assert(
        "Expected event, got '" + result.logs + "' instead",
    );
    assert.fail();
};