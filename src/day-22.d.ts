/** because "dashing" implies speed */
type Dasher = "💨";

/** representing dancing or grace */
type Dancer = "💃";

/** a deer, prancing */
type Prancer = "🦌";

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = "🌟";

/** for the celestial body that shares its name */
type Comet = "☄️";

/** symbolizing love, as Cupid is the god of love */
type Cupid = "❤️";

/** representing thunder, as "Donner" means thunder in German */
type Donner = "🌩️";

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = "⚡";

/** for his famous red nose */
type Rudolph = "🔴";

type Reindeer =
    | Dasher
    | Dancer
    | Prancer
    | Vixen
    | Comet
    | Cupid
    | Donner
    | Blitzen
    | Rudolph;

/******************************************************************************/

type MapBox<N extends number> = [
    [[0, 0], [1, 0], [2, 0]],
    [[3, 0], [4, 0], [5, 0]],
    [[6, 0], [7, 0], [8, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[3, 1], [4, 1], [5, 1]],
    [[6, 1], [7, 1], [8, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[3, 2], [4, 2], [5, 2]],
    [[6, 2], [7, 2], [8, 2]],
][N];

type ToInt<T> = T extends `${infer N extends number}` ? N : never;

type Flatten<T extends any[][], U extends any[] = []> = T extends [
    infer F extends any[],
    ...infer R extends any[][],
]
    ? Flatten<R, [...U, ...F]>
    : U;

type FlattenSudokuBoard<BOARD extends Reindeer[][][]> = {
    [R in keyof BOARD]: Flatten<BOARD[R]>;
};

type GetRow<
    BOARD extends Reindeer[][],
    ROW extends number,
> = BOARD[ROW][number];

type GetColumn<BOARD extends Reindeer[][], COL extends number> = {
    [ROW in keyof BOARD]: BOARD[ROW][COL];
}[number];

type GetBox<BOARD extends Reindeer[][][], IDX extends number> =
    | BOARD[MapBox<IDX>[0][0]][MapBox<IDX>[0][1]][number]
    | BOARD[MapBox<IDX>[1][0]][MapBox<IDX>[1][1]][number]
    | BOARD[MapBox<IDX>[2][0]][MapBox<IDX>[2][1]][number];

type CheckRow<
    BOARD extends Reindeer[][],
    ROW extends number,
> = Reindeer extends GetRow<BOARD, ROW> ? true : false;

type CheckColumn<
    BOARD extends Reindeer[][],
    COL extends number,
> = Reindeer extends GetColumn<BOARD, COL> ? true : false;

type CheckBox<
    BOARD extends Reindeer[][][],
    IDX extends number,
> = Reindeer extends GetBox<BOARD, IDX> ? true : false;

type CheckAllRows<BOARD extends Reindeer[][]> = ToInt<
    keyof BOARD
> extends infer N extends number
    ? CheckRow<BOARD, N>
    : false;

type CheckAllColumns<BOARD extends Reindeer[][]> = ToInt<
    keyof BOARD
> extends infer N extends number
    ? CheckColumn<BOARD, N>
    : false;

type CheckAllBoxes<
    BOARD extends Reindeer[][][],
    BOARD_INT extends number = ToInt<keyof BOARD>,
> = BOARD_INT extends infer N extends number ? CheckBox<BOARD, N> : false;

type Validate<BOARD extends Reindeer[][][]> = CheckAllRows<
    FlattenSudokuBoard<BOARD>
> extends true
    ? CheckAllColumns<FlattenSudokuBoard<BOARD>> extends true
        ? CheckAllBoxes<BOARD> extends true
            ? true
            : false
        : false
    : false;
