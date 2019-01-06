/// adjust time of the next block in seconds
export default async addSeconds => (
    new Promise(res => web3.currentProvider.send({
            jsonrpc: "2.0", 
            method: "evm_increaseTime", 
            params: [addSeconds], 
            id: new Date().getSeconds(),
        }, (error, resp) => {
            
            // web3.currentProvider.send({
            //     jsonrpc: '2.0', 
            //     method: 'evm_mine', 
            //     params: [], 
            //     id: new Date().getSeconds()
            // }, (_error, _resp) => {
            //     res(_resp);
            // });
            res(resp);
    }))
)