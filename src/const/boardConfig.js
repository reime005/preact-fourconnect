export const boardSize = {
	columns: 7,
	rows: 6
};

export const CELL_SUM = boardSize.rows * boardSize.columns;

export const WINNER_COUNT = 4;

export const colors = {
	CELL_DEFAULT: '#4b7ffa',
	CELL_SELECTED: '#ddd',
	CELL_SET_BLUE: '#e81916',
	CELL_SET_YELLOW: '#f7ec17',
	ROW_DEFAULT: '#185bfa',
	ROW_SELECTED: '#4b7ffa',
	BLACK: '#0f0f0f',
	WHITE: '#f0f0f0'
};

export const players = {
	NONE: 0,
	SELECTED: -1,
	ONE: 1,
	TWO: 2
};