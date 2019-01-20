import expectRevert from './helpers/expectRevert';
import expectEvent from './helpers/expectEvent';
import createAndJoinGame from './helpers/createAndJoinGame';
import { FourConnect, paymentOne, paymentTwo } from './constants';

/*
    0   1   2   3   4   5   6
    7   8   9   10	11	12	13
    14	15	16	17	18	19	20
    21	22	23	24	25	26	27
    28	29	30	31	32	33	34
    35	36	37	38	39	40	41
*/
contract('FourConnect', async (accounts) => {
    it('should let 2nd player move and claim victory vertical', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 35, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 36, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 28, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 29, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 39, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 22, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 32, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMoveAndClaimVictory(id, 15, [36, 29, 22, 15], {from: accounts[1]}), "logGameEnd");

        const winner = await instance.getWinner.call(id);
        await assert.strictEqual(winner.toString(), accounts[1]);
    });
    it('should let 1st player move and claim victory diagonal', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 35, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 36, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 29, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 37, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 30, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 38, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 23, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 31, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 24, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 41, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMoveAndClaimVictory(id, 17, [35, 29, 23, 17], {from: accounts[0]}), "logGameEnd");

        const winner = await instance.getWinner.call(id);
        await assert.strictEqual(winner.toString(), accounts[0]);
    });
    /*
    0   1   2   3   4   5   6
    7   8   9   10	11	12	13
    14	15	16	17	18	19	20
    21	22	23	24	25	26	27
    28	29	30	31	32	33	34
    35	36	37	38	39	40	41
*/
    it('should let 1st player move and claim victory horizontal', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[5], accounts[9]);

        await expectEvent(instance.makeMove(id, 35, {from: accounts[5]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 28, {from: accounts[9]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 36, {from: accounts[5]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 29, {from: accounts[9]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 37, {from: accounts[5]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 30, {from: accounts[9]}), "logGameMoveMade");
        await expectEvent(instance.makeMoveAndClaimVictory(id, 38, [38, 37, 36, 35], {from: accounts[5]}), "logGameEnd");

        const winner = await instance.getWinner.call(id);
        await assert.strictEqual(winner.toString(), accounts[5]);
    });
    it('should not let someone claim victory with incorrect claim', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 35, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 36, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 28, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 29, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 39, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 22, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 21, {from: accounts[0]}), "logGameMoveMade");
        
        await expectRevert(instance.makeMoveAndClaimVictory(id, 15, [36, 33, 22, 15], {from: accounts[1]}));
        await expectRevert(instance.makeMoveAndClaimVictory(id, 17, [33, 22, 15, 3], {from: accounts[1]}));
        await expectRevert(instance.makeMoveAndClaimVictory(id, 38, [35, 28, 21, 14], {from: accounts[1]}));
    });
    it('should not let 1st player move and claim victory', async () => {
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 35, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 36, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 28, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 29, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 21, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 22, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 39, {from: accounts[0]}), "logGameMoveMade");
        
        await expectRevert(instance.makeMoveAndClaimVictory(id, 14, [35, 28, 21, 14], {from: accounts[0]}));
        await expectRevert(instance.makeMoveAndClaimVictory(id, 40, [35, 28, 21, 14], {from: accounts[0]}));
    });
}); 