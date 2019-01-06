import { BigNumber } from 'bignumber.js';

export default async transaction => {
    const txResult = await transaction;
    const gasUsed = txResult.receipt.gasUsed;
    const tx = await web3.eth.getTransaction(txResult.tx);
    return new BigNumber(tx.gasPrice).multipliedBy(new BigNumber(gasUsed));
}