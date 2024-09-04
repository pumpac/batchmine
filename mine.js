const config = require('./config.js');
const ethers = require('ethers');
const provider = new ethers.JsonRpcProvider(config.RPC);
const miner = new ethers.Wallet(config.PRIVATE_KEY, provider);
const PUMPAC_ADDRESS = '0xaF03B57506995e187A5a172d50D9bEC70969DD88';
const PUMPAC_ABI = require('./abi.json')
const pumpac = new ethers.Contract(PUMPAC_ADDRESS, PUMPAC_ABI, miner);


async function batchMine (_nonce) {
    try {
        const tx = await pumpac.connect(miner).batchMine('0x',config.BATCH_MINE_AMOUNT, { nonce: _nonce, gasLimit: 25000000 })
        console.log('Mine transaction sent with the nonce', _nonce)
        tx.wait().then(result => {
            console.log('Mine transaction confirmed with the nonce', _nonce)
        })
    } catch (e) {
        console.error('An error occurred while executing the transaction with the nonce', _nonce, e)
    }
}

provider.getTransactionCount(miner.address).then(nonce => {
    batchMine(nonce)

    setInterval(() => {
        batchMine(++nonce)
    }, 60000 / config.MINE_TX_PER_MINUTE)
})

