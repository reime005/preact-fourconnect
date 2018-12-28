import { players, colors } from '../const/boardConfig';

export const playerToCellColor = n => {
	switch (n) {
		case players.NONE:
			return colors.CELL_DEFAULT;
		case players.SELECTED:
			return colors.CELL_SELECTED;
		case players.ONE:
			return colors.CELL_SET_BLUE;
		case players.TWO:
			return colors.CELL_SET_YELLOW;
	}
};

export const playerToColumnColor = n => {
	switch (n) {
		case players.NONE:
		case players.ONE:
		case players.TWO:
			return colors.ROW_DEFAULT;
		case players.SELECTED:
			return colors.ROW_SELECTED;
	}
};

export const playerToTextColor = n => {
	switch (n) {
		case players.NONE:
			return colors.BLACK;
		case players.ONE:
			return colors.WHITE;
		case players.TWO:
			return colors.BLACK;
	}
};