type Connect4Chips = "🔴" | "🟡";
type Connect4Cell = Connect4Chips | "  ";
type Connect4State = "🔴" | "🟡" | "🔴 Won" | "🟡 Won" | "Draw";

type Connect4EmptyBoard = [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
];

type Connect4NewGame = {
    board: Connect4EmptyBoard;
    state: "🟡";
};

/******************************************************************************/

type Connect4ToInt<T> = T extends `${infer N extends number}` ? N : never;

type Connect4DiagonalMap = [
    [[0, 3], [1, 2], [2, 1], [3, 0]],
    [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]],
    [[0, 5], [1, 4], [2, 3], [3, 2], [4, 1], [5, 0]],
    [[0, 6], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1]],
    [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2]],
    [[2, 6], [3, 5], [4, 4], [5, 3]],
    [[2, 0], [3, 1], [4, 2], [5, 3]],
    [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4]],
    [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
    [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]],
    [[0, 3], [1, 4], [2, 5], [3, 6]],
];

type Connect4FindEmptyRow<
    BOARD extends Connect4Cell[][],
    COL extends number,
> = BOARD extends [
    ...infer ROWS extends Connect4Cell[][],
    infer ROW extends Connect4Cell[],
]
    ? ROW[COL] extends "  "
        ? ROWS["length"]
        : Connect4FindEmptyRow<ROWS, COL>
    : never;

type Connect4ArrayReplaceAt<ARRAY extends any[], IDX extends number, VALUE> = {
    [KEY in keyof ARRAY]: KEY extends `${IDX}` ? VALUE : ARRAY[KEY];
};

type Connect4MatrixReplaceAt<
    MATRIX extends any[][],
    POS extends [number, number],
    VALUE,
> = {
    [KEY in keyof MATRIX]: KEY extends `${POS[1]}`
        ? Connect4ArrayReplaceAt<MATRIX[KEY], POS[0], VALUE>
        : MATRIX[KEY];
};

type Connect4PlaceChip<
    BOARD extends Connect4Cell[][],
    COL extends number,
    STATE extends Connect4State,
> = STATE extends Connect4Chips
    ? Connect4FindEmptyRow<BOARD, COL> extends infer ROW extends number
        ? Extract<
              Connect4MatrixReplaceAt<BOARD, [COL, ROW], STATE>,
              Connect4Cell[][]
          >
        : BOARD
    : BOARD;

type Connect4Check4<
    BOARD extends Connect4Cell[],
    CHIPS extends Connect4Chips[] = [],
> = CHIPS["length"] extends 4
    ? CHIPS[0]
    : BOARD extends [infer F, ...infer R extends Connect4Cell[]]
      ? F extends Connect4Chips
          ? [CHIPS[0]] extends [F]
              ? Connect4Check4<R, [...CHIPS, F]>
              : Connect4Check4<R, [F]>
          : Connect4Check4<R>
      : never;

type Connect4GetRow<
    BOARD extends Connect4Cell[][],
    ROW extends number,
> = BOARD[ROW];

type Connect4WinnerInRows<
    BOARD extends Connect4Cell[][],
    ROWS = Connect4ToInt<keyof BOARD>,
> = ROWS extends number ? Connect4Check4<Connect4GetRow<BOARD, ROWS>> : never;

type Connect4GetColumn<BOARD extends Connect4Cell[][], COL extends number> = {
    [KEY in keyof BOARD]: BOARD[KEY][COL];
};

type Connect4WinnerInColumns<
    BOARD extends Connect4Cell[][],
    COLS = Connect4ToInt<keyof BOARD[0]>,
> = COLS extends number
    ? Connect4Check4<Connect4GetColumn<BOARD, COLS>>
    : never;

type Connect4GetDiagonal<
    BOARD extends Connect4Cell[][],
    N extends number,
    MAP extends [number, number][] = Connect4DiagonalMap[N],
    CELLS extends Connect4Cell[] = [],
> = MAP extends [
    infer F extends [number, number],
    ...infer R extends [number, number][],
]
    ? Connect4GetDiagonal<BOARD, N, R, [BOARD[F[0]][F[1]], ...CELLS]>
    : CELLS;

type Connect4WinnerInDiagonals<BOARD extends Connect4Cell[][]> = Connect4ToInt<
    keyof Connect4DiagonalMap
> extends number
    ? Connect4Check4<
          Connect4GetDiagonal<BOARD, Connect4ToInt<keyof Connect4DiagonalMap>>
      >
    : never;

type Connect4Winner<BOARD extends Connect4Cell[][]> =
    | Connect4WinnerInRows<BOARD>
    | Connect4WinnerInColumns<BOARD>
    | Connect4WinnerInDiagonals<BOARD>;

type Connect4CheckDraw<BOARD extends Connect4Cell[][]> =
    "  " extends BOARD[number][number] ? false : true;

type NextGameState<
    BOARD extends Connect4Cell[][],
    STATE extends Connect4State,
> = [Connect4Winner<BOARD>] extends [never]
    ? Connect4CheckDraw<BOARD> extends false
        ? STATE extends "🔴"
            ? "🟡"
            : "🔴"
        : "Draw"
    : `${Connect4Winner<BOARD>} Won`;

type Connect4<
    BOARD extends { board: Connect4Cell[][]; state: Connect4State },
    COL extends number,
    NEW_BOARD extends Connect4Cell[][] = Connect4PlaceChip<
        BOARD["board"],
        COL,
        BOARD["state"]
    >,
    NEW_STATE = NextGameState<NEW_BOARD, BOARD["state"]>,
> = {
    board: NEW_BOARD;
    state: NEW_STATE;
};
