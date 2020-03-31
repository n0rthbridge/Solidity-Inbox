const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
//rinkeby.infura.io/v3/141f097af9334fd8bf9c1424eb0ef1df
//const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
	// Get a list of all Accounts
	accounts = await web3.eth.getAccounts();
	// Use of of those accounts to deploy
	// the contract
	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({ data: bytecode, arguments: ['Hi There!'] })
		.send({ from: accounts[0], gas: '1000000' });
    inbox.setProvider(provider);
});

describe('Inbox', () =>{
	it('Deploys a Contract', () => {
		assert.ok(inbox.options.address);
	});
	it('has a default message', async () => {
		const message = await inbox.methods.message().call();
		assert.equal(message, 'Hi There!');
	})
	it('can change the message', async () => {
		//set message and submit transaction
		await inbox.methods.setMessage('bye').send({ from: accounts[0] });
		//retrieve new message and assert
		const message = await inbox.methods.message().call();
		assert.equal(message, 'bye');
	});
});