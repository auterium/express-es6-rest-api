import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('	https://rinkeby.infura.io/RqGW0YN5jyd8cVeTjrbj'));
const { isAddress, isHexStrict, toWei } = web3.utils;
const { accounts, getBalance: eGetBalance, sendSignedTransaction } = web3.eth;

export const createWallet = (req, res) => {
	res.json(accounts.create());
};

export const getBalance = ({ params: { param } }, res) => {
	if(!isAddress(param)) {
		return res.status(422).send({ error: 'Invalid address: ' + param });
	}

	eGetBalance(param).then(balance => {
		res.json({
			address: param,
			balance: parseInt(balance)/1000000000000000000
		});
	});
};

export const transaction = (req, res) => {
	const { privateKey, destination, amount } = req.body;

	if(!isAddress(destination)) {
		return res.status(422).send({ error: 'Invalid destination address: ' + destination });
	}

	if(isNaN(amount) || amount<=0) {
		return res.status(422).send({ error: 'Invalid amount: ' + amount });
	}

	if(!isHexStrict(privateKey)) {
		return res.status(422).send({ error: 'Private key is not a hex: ' + destination });
	}

	const account = accounts.privateKeyToAccount(privateKey);

	account.signTransaction({
		gas: 21000,
		to: destination,
		value: toWei('' + amount, 'ether'),
		chainId: 4
	})
	.then(({ rawTransaction }) => sendSignedTransaction(rawTransaction))
	.then(receipt => res.json({ receipt }))
	.catch(({ message }) => {
		res.status(422).send({ error: message });
	});
};
