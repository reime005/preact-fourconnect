import { h, Component } from 'preact';
import style from './style';

export const GameEnd = ({ isGameEnd, won, onGameEndClick }) => (
	!isGameEnd ? null :
	<div class={style.gameEnd} onClick={onGameEndClick}>
		{won && <h1>You won!</h1>}
		{!won && <h1>You lost!</h1>}
	</div>
);
