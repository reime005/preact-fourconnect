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
    it('should make moves when allowed', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 35, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 28, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 38, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 37, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 30, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 21, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 36, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 29, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 22, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 41, {from: accounts[1]}), "logGameMoveMade");
    });
    it('must not make a move twice', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 35, {from: accounts[0]}), "logGameMoveMade");
        await expectRevert(instance.makeMove(id, 35, {from: accounts[0]}));
    });
    it('must not make a move outside the game', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectRevert(instance.makeMove(id, 45, {from: accounts[0]}));
    });
    it('should not allow the wrong player to make first move', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectRevert(instance.makeMove(id, 38, {from: accounts[1]}));
    });
    it('should not allow to make a wrong move', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectRevert(instance.makeMove(id, 28, {from: accounts[0]}));
        await expectRevert(instance.makeMove(id, 34, {from: accounts[0]}));
        await expectRevert(instance.makeMove(id, 0, {from: accounts[0]}));
        await expectRevert(instance.makeMove(id, 6, {from: accounts[0]}));
        await expectRevert(instance.makeMove(id, 3, {from: accounts[0]}));
    });

    it('should not make same move as player before', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);
        
        await expectEvent(instance.makeMove(id, 35, {from: accounts[0]}), "logGameMoveMade");
        await expectRevert(instance.makeMove(id, 35, {from: accounts[1]}));
    });
    it('should not make invalid moves', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 40, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 33, {from: accounts[1]}), "logGameMoveMade");
        await expectRevert(instance.makeMove(id, 34, {from: accounts[0]}));
    });
}); 