import { h } from 'preact';
import style from './style';

const Home = ({ isRunning, onNewGame }) => (
	<div class={style.home}>
		<h1>Start a new Game</h1>
		<button onClick={onNewGame}>New Game</button>
	</div>
);

export default Home;
