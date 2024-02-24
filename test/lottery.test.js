const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()
    lottery = await new web3.eth.Contract(abi)
    .deploy({
        data: evm.bytecode.object
    })
    .send({ from: accounts[0], gas: '1000000' });
    console.log(abi);
});

describe('Lottery Contracts', () => {
    it('Deployes a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('Allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
         });
         const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
         assert.equal(accounts[0], players[0]);
         assert.equal(players.length, 1);
    });

    it('Allows multiple account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
         });
         await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
         });
         await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
         });
         const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
         assert.equal(accounts[0], players[0]);
         assert.equal(accounts[1], players[1]);
         assert.equal(accounts[2], players[2]);
         assert.equal(players.length, 3);
    });

    it('Requires minimum amount of ether', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('Only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('Sends money to the winner and resets player array', async () => {
        await lottery.methods.enter().send({
             from: accounts[0],
             value: web3.utils.toWei('1', 'ether')
            });

        const initBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[2]);
        const difference = finalBalance - initBalance;
        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });
        assert(difference > web3.utils.toWei('0.8', 'ether'));
        assert.equal(players.length, 0);
    });
});
