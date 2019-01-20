import expectRevert from './helpers/expectRevert';
import expectEvent from './helpers/expectEvent';
import createAndJoinGame from './helpers/createAndJoinGame';
import increaseTimeSeconds from './helpers/increaseTimeSeconds';
import createGame from './helpers/createGame';
import getTransactionGasCost from './helpers/getTransactionGasCost';
import { FourConnect, payment, paymentOne, paymentTwo } from './constants';
import { BigNumber } from 'bignumber.js';

/*
    0   1   2   3   4   5   6
    7   8   9   10	11	12	13
    14	15	16	17	18	19	20
    21	22	23	24	25	26	27
    28	29	30	31	32	33	34
    35	36	37	38	39	40	41
*/
contract('FourConnect', async (accounts) => {
    it('should not let someone give up when the game has not started', async () => {
        const instance = await FourConnect.deployed();

        await expectRevert(instance.giveUp(12353, {from: accounts[0]}));
    });
    it('should not let someone give up which is not a player', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectRevert(instance.giveUp(id, {from: accounts[4]}));
    });
    it('should not let someone give up twice', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.giveUp(id, {from: accounts[0]}), 'logGameEnd');
        await expectRevert(instance.giveUp(id, {from: accounts[0]}));
    });
    it('should not let someone give up when already given up', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.giveUp(id, {from: accounts[1]}), 'logGameEnd');
        await expectRevert(instance.giveUp(id, {from: accounts[0]}));
    });
    it('should not let someone give up a non existing game', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectRevert(instance.giveUp(5321, {from: accounts[0]}));
        await expectRevert(instance.giveUp(5321, {from: accounts[8]}));
    });

    it('should let player1 give up, so player2 is the winner', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.giveUp(id, {from: accounts[0]}), 'logGameEnd');

        const winner = await instance.getWinner.call(id);
        assert.strictEqual(winner, accounts[1]);
    });
    it('should let player2 give up, so player1 is the winner', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[6], accounts[7]);

        await expectEvent(instance.giveUp(id, {from: accounts[7]}), 'logGameEnd');

        const winner = await instance.getWinner.call(id);
        assert.strictEqual(winner, accounts[6]);
    });
    it('should let someone cancel a game when nobody joined yet', async () => {
        const instance = await FourConnect.deployed();
        const id = await createGame(instance, paymentOne, accounts[5]);

        await increaseTimeSeconds(60 * 35);

        await expectEvent(instance.cancelCreatedGame(id, {from: accounts[5]}), 'logGameCanceled');
    });
    it('should not let someone cancel a game when running', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[5], accounts[6]);

        await expectRevert(instance.cancelCreatedGame(id, {from: accounts[5]}));
    });
    it('should let someone claim victory when other player timed out', async () => {
        const instance = await FourConnect.deployed();

        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[5], accounts[6]);

        await increaseTimeSeconds(60 * 60 * 1.1);
        
        await expectEvent(instance.claimTimeoutVictory(id, {from: accounts[6]}), 'logGameEnd');

        const balAcc6Pre = await web3.eth.getBalance(accounts[6]);

        const gasCost = await getTransactionGasCost(instance.withdraw(id, {from: accounts[6]}));

        const balAcc6Post = await web3.eth.getBalance(accounts[6]);

        const expected = new BigNumber(balAcc6Post).plus(new BigNumber(gasCost)).minus(new BigNumber(payment));

        await assert.strictEqual(
            expected.toString(), 
            balAcc6Pre
        );
    });
    it('should not let someone claim victory when other player has not timed out yet', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[5], accounts[6]);

        await expectRevert(instance.claimTimeoutVictory(id, {from: accounts[6]}));
    });
    it('should not let someone move after timeout', async () => {
        const instance = await FourConnect.deployed();

        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[5], accounts[6]);
        
        await expectEvent(instance.makeMove(id, 35, {from: accounts[5]}), "logGameMoveMade");

        await increaseTimeSeconds(60 * 61);

        await expectEvent(instance.claimTimeoutVictory(id, {from: accounts[5]}), 'logGameEnd');

        const balAcc5Pre = await web3.eth.getBalance(accounts[5]);

        const gasCost = await getTransactionGasCost(instance.withdraw(id, {from: accounts[5]}));

        const balAcc5Post = await web3.eth.getBalance(accounts[5]);

        const expected = new BigNumber(balAcc5Post).plus(new BigNumber(gasCost)).minus(new BigNumber(payment)); 

        await assert.equal(
            expected.toString(), 
            balAcc5Pre
        );
    });
}); 