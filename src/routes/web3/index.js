import { h, Component } from 'preact';
import { Drizzle, generateStore } from 'drizzle'

import style from './style';
import drizzleOptions from '../../const/drizzleOptions';
import getWeb3 from '../../helpers/web3/getWeb3';

class Web3 extends Component {
	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		if (typeof process === 'undefined') {
			return;
		}
		const web3 = await getWeb3();

		web3.eth.getAccounts(
      (error, accounts) => (error ? reject(error) : console.log(accounts))
    )
		console.log(web3);
		const drizzleStore = generateStore(drizzleOptions);
		const drizzle = new Drizzle(drizzleOptions, drizzleStore);

		console.log(drizzle);
	}

	render() {
		return null;
	}
}

export default Web3;
