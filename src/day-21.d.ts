type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
    board: TicTactToeBoard;
    state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
    board: EmptyBoard;
    state: "❌";
};

/******************************************************************************/

type ROW_INDEX = {
    top: 0;
    middle: 1;
    bottom: 2;
};

type COL_INDEX = {
    left: 0;
    center: 1;
    right: 2;
};

type SELECT_POSITION<
    BOARD extends TicTactToeBoard,
    STATE extends TicTacToeState,
    ROW extends number,
    COL extends number,
> = {
    [R in keyof BOARD]: R extends `${ROW}`
        ? SELECT_POSITION_COL<BOARD[R], STATE, COL>
        : BOARD[R];
};

type SELECT_POSITION_COL<
    CELLS extends TicTacToeCell[],
    STATE extends TicTacToeState,
    COL extends number,
> = { [C in keyof CELLS]: C extends `${COL}` ? STATE : CELLS[C] };

type EVAL_STATE<
    BOARD extends TicTactToeBoard,
    STATE extends TicTacToeState,
> = STATE extends TicTacToeEndState
    ? STATE
    : IS_WIN<BOARD, STATE> extends true
      ? `${STATE} Won`
      : IS_DRAW<BOARD> extends true
        ? "Draw"
        : Exclude<TicTacToeChip, STATE>;

type IS_WIN<BOARD extends TicTactToeBoard, STATE extends TicTacToeState> = [
    STATE,
    STATE,
    STATE,
] extends [...ROW_WINS<BOARD>, ...COL_WINS<BOARD>][number]
    ? true
    : false;

type ROW_WINS<BOARD extends TicTactToeBoard> = [
    [BOARD[0][0], BOARD[1][0], BOARD[2][0]],
    [BOARD[0][1], BOARD[1][1], BOARD[2][1]],
    [BOARD[0][2], BOARD[1][2], BOARD[2][2]],
];

type COL_WINS<BOARD extends TicTactToeBoard> = [
    [BOARD[0][0], BOARD[1][1], BOARD[2][2]],
    [BOARD[0][2], BOARD[1][1], BOARD[2][0]],
];

type IS_DRAW<BOARD extends TicTactToeBoard> =
    TicTacToeEmptyCell extends BOARD[number][number] ? false : true;

type TicTacToe<
    GAME extends TicTacToeGame,
    POSITION extends TicTacToePositions,
> = POSITION extends `${infer ROW extends
    TicTacToeYPositions}-${infer COL extends TicTacToeXPositions}`
    ? GAME["board"][ROW_INDEX[ROW]][COL_INDEX[COL]] extends TicTacToeChip
        ? GAME
        : SELECT_POSITION<
                GAME["board"],
                GAME["state"],
                ROW_INDEX[ROW],
                COL_INDEX[COL]
            > extends infer NEW_BOARD extends TicTactToeBoard
          ? { board: NEW_BOARD; state: EVAL_STATE<NEW_BOARD, GAME["state"]> }
          : never
    : never;
