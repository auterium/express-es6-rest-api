import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import { createWallet, getBalance, transaction } from './walletHandler';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.get('/createWallet', createWallet);
	api.get('/getBalance/:param', getBalance);
	api.post('/transaction', transaction);

	return api;
}
