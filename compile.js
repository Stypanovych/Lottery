const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

try {
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Lottery.sol'
].Lottery;
} catch (error) {
  console.error('Error compiling Solidity code:', error);
}
