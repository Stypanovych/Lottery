const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require('./compile');
const { interfaces } = require('mocha');

const provider = new HDWalletProvider(
    '', // add mnemonics
    '', // set network
);

const web3 = new Web3(provider);
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from accounts');
    const result = await new web3.eth.Contract(abi)
    .deploy({
        data: evm.bytecode.object
    })
    .send({ gas: '1000000', from: accounts[0] });

    console.log(abi);
    console.log('Contract deployed to', result.options.address);
};
deploy();
