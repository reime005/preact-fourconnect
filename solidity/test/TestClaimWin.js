import expectRevert from './helpers/expectRevert';
import expectEvent from './helpers/expectEvent';
import createAndJoinGame from './helpers/createAndJoinGame';
import { FourConnect, paymentOne, paymentTwo } from './constants';

/*
    35	36	37	38	39	40	41
    28	29	30	31	32	33	34
    21	22	23	24	25	26	27
    14	15	16	17	18	19	20
    7	8	9	10	11	12	13
    0	1	2	3	4	5	6
*/
contract('FourConnect', async (accounts) => {
    // it('should let 2nd player move and claim victory vertical', async () => {
    //     const instance = await FourConnect.deployed();
    //     const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

    //     await expectEvent(instance.makeMove(id, 0, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 1, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 7, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 8, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 4, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 15, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 11, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMoveAndClaimVictory(id, 22, [1, 8, 15, 22], {from: accounts[1]}), "logGameEnd");

    //     const winner = await instance.getWinner.call(id);
    //     await assert.strictEqual(winner.toString(), accounts[1]);
    // });
    // it('should let 1st player move and claim victory diagonal', async () => {
    //     const instance = await FourConnect.deployed();
    //     const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

    //     await expectEvent(instance.makeMove(id, 0, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 1, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 8, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 2, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 9, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 3, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 16, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 10, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 17, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 6, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMoveAndClaimVictory(id, 24, [0, 8, 16, 24], {from: accounts[0]}), "logGameEnd");

    //     const winner = await instance.getWinner.call(id);
    //     await assert.strictEqual(winner.toString(), accounts[0]);
    // });
    // it('should let 1st player move and claim victory horizontal', async () => {
    //     const instance = await FourConnect.deployed();
    //     const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[5], accounts[9]);

    //     await expectEvent(instance.makeMove(id, 0, {from: accounts[5]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 7, {from: accounts[9]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 1, {from: accounts[5]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 8, {from: accounts[9]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 2, {from: accounts[5]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 9, {from: accounts[9]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMoveAndClaimVictory(id, 3, [0, 1, 2, 3], {from: accounts[5]}), "logGameEnd");

    //     const winner = await instance.getWinner.call(id);
    //     await assert.strictEqual(winner.toString(), accounts[5]);
    // });
    // it('should not let someone claim victory with incorrect claim', async () => {
    //     const instance = await FourConnect.deployed();
    //     const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

    //     await expectEvent(instance.makeMove(id, 0, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 1, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 7, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 8, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 4, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 15, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 14, {from: accounts[0]}), "logGameMoveMade");
        
    //     await expectRevert(instance.makeMoveAndClaimVictory(id, 22, [1, 12, 15, 22], {from: accounts[1]}));
    //     await expectRevert(instance.makeMoveAndClaimVictory(id, 24, [12, 15, 22], {from: accounts[1]}));
    //     await expectRevert(instance.makeMoveAndClaimVictory(id, 3, [0, 7, 14, 21], {from: accounts[1]}));
    // });
    // it('should not let 1st player move and claim victory', async () => {
    //     const instance = await FourConnect.deployed();
    //     const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

    //     await expectEvent(instance.makeMove(id, 0, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 1, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 7, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 8, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 14, {from: accounts[0]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 15, {from: accounts[1]}), "logGameMoveMade");
    //     await expectEvent(instance.makeMove(id, 4, {from: accounts[0]}), "logGameMoveMade");
        
    //     await expectRevert(instance.makeMoveAndClaimVictory(id, 21, [0, 7, 14, 21], {from: accounts[0]}));
    //     await expectRevert(instance.makeMoveAndClaimVictory(id, 5, [0, 7, 14, 21], {from: accounts[0]}));
    // });
}); 