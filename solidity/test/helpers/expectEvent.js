
export default async function expectEvent(promise, eventName = '') {
        try {
            let result = await promise;

        let found = false;
    
        if (Array.isArray(result.logs)) {
            found = result.logs.find(log => log.event === eventName);
        } 
    
        if (found) {
            return;
        }

        assert.fail("Expected event, got '" + result.logs + "' instead");
        }  catch (e) {
            console.log(e);
        }

        assert.fail();
};