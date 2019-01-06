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
    it('should make moves when allowed', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 0, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 7, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 3, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 2, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 9, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 14, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 1, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 8, {from: accounts[1]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 15, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 6, {from: accounts[1]}), "logGameMoveMade");
    });
    it('must not make a move twice', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 0, {from: accounts[0]}), "logGameMoveMade");
        await expectRevert(instance.makeMove(id, 0, {from: accounts[0]}));
    });
    it('must not make a move outside the game', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectRevert(instance.makeMove(id, 45, {from: accounts[0]}));
    });
    it('should not allow the wrong player to make first move', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectRevert(instance.makeMove(id, 3, {from: accounts[1]}));
    });
    it('should not allow to make a wrong move', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectRevert(instance.makeMove(id, 7, {from: accounts[0]}));
    });

    it('should not make same move as player before', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);
        
        await expectEvent(instance.makeMove(id, 0, {from: accounts[0]}), "logGameMoveMade");
        await expectRevert(instance.makeMove(id, 0, {from: accounts[1]}));
    });
    it('should not make invalid moves', async function(){
        const instance = await FourConnect.deployed();
        const id = await createAndJoinGame(instance, paymentOne, paymentTwo, accounts[0], accounts[1]);

        await expectEvent(instance.makeMove(id, 5, {from: accounts[0]}), "logGameMoveMade");
        await expectEvent(instance.makeMove(id, 12, {from: accounts[1]}), "logGameMoveMade");
        await expectRevert(instance.makeMove(id, 13, {from: accounts[0]}));
    });
}); 