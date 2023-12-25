type Alley = "  ";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

/******************************************************************************/

type Maze_BuildTuple<
    SIZE extends number,
    OUT extends any[] = [],
    VALUE = any,
> = OUT["length"] extends SIZE
    ? OUT
    : Maze_BuildTuple<SIZE, [...OUT, VALUE], VALUE>;

type Maze_Increment<N extends number> = [...Maze_BuildTuple<N>, 1]["length"];

type Maze_Decrement<N extends number> = Maze_BuildTuple<N> extends [
    infer _,
    ...infer R,
]
    ? R["length"]
    : never;

type Maze_FindSantaColumn<
    COL extends MazeItem[],
    IDX extends number[] = [],
> = COL extends [infer F, ...infer R extends MazeItem[]]
    ? F extends "🎅"
        ? IDX["length"]
        : Maze_FindSantaColumn<R, [...IDX, 0]>
    : never;

type Maze_FindSanta<
    MATRIX extends MazeMatrix,
    IDX extends number[] = [],
> = MATRIX extends [infer F extends MazeItem[], ...infer R extends MazeMatrix]
    ? "🎅" extends F[number]
        ? [IDX["length"], Maze_FindSantaColumn<F>]
        : Maze_FindSanta<R, [...IDX, 0]>
    : never;

type Maze_Escape<MATRIX extends MazeMatrix> = MATRIX extends [
    infer F extends MazeItem[],
    ...infer R extends MazeMatrix,
]
    ? [Maze_BuildTuple<F["length"], [], DELICIOUS_COOKIES>, ...Maze_Escape<R>]
    : [];

type Maze_RemoveSantaFromRow<ROW extends MazeItem[]> = ROW extends [
    infer F,
    ...infer R extends MazeItem[],
]
    ? F extends "🎅"
        ? [Alley, ...Maze_RemoveSantaFromRow<R>]
        : [F, ...Maze_RemoveSantaFromRow<R>]
    : [];

type Maze_RemoveSanta<MATRIX extends MazeMatrix> = MATRIX extends [
    infer F extends MazeItem[],
    ...infer R extends MazeMatrix,
]
    ? [Maze_RemoveSantaFromRow<F>, ...Maze_RemoveSanta<R>]
    : [];

type Maze_FillSantaToColumn<
    COL extends MazeItem[],
    IDX extends number,
    COUNT extends number[] = [],
> = COL extends [infer F, ...infer R extends MazeItem[]]
    ? COUNT["length"] extends IDX
        ? ["🎅", ...Maze_FillSantaToColumn<R, IDX, [...COUNT, 0]>]
        : [F, ...Maze_FillSantaToColumn<R, IDX, [...COUNT, 0]>]
    : [];

type Maze_FillSanta<
    MATRIX extends MazeMatrix,
    ROW extends number,
    COL extends number,
    COUNT extends number[] = [],
> = MATRIX extends [infer F extends MazeItem[], ...infer R extends MazeMatrix]
    ? COUNT["length"] extends ROW
        ? [
              Maze_FillSantaToColumn<F, COL>,
              ...Maze_FillSanta<R, ROW, COL, [...COUNT, 0]>,
          ]
        : [F, ...Maze_FillSanta<R, ROW, COL, [...COUNT, 0]>]
    : [];

type Maze_MoveUp<MATRIX extends MazeMatrix> =
    Maze_FindSanta<MATRIX>[0] extends 0
        ? Maze_Escape<MATRIX>
        : MATRIX[Maze_Decrement<
                Maze_FindSanta<MATRIX>[0]
            >][Maze_FindSanta<MATRIX>[1]] extends Alley
          ? Maze_FillSanta<
                Maze_RemoveSanta<MATRIX>,
                Maze_Decrement<Maze_FindSanta<MATRIX>[0]>,
                Maze_FindSanta<MATRIX>[1]
            >
          : MATRIX;

type Maze_MoveLeft<MATRIX extends MazeMatrix> =
    Maze_FindSanta<MATRIX>[1] extends 0
        ? Maze_Escape<MATRIX>
        : MATRIX[Maze_FindSanta<MATRIX>[0]][Maze_Decrement<
                Maze_FindSanta<MATRIX>[1]
            >] extends Alley
          ? Maze_FillSanta<
                Maze_RemoveSanta<MATRIX>,
                Maze_FindSanta<MATRIX>[0],
                Maze_Decrement<Maze_FindSanta<MATRIX>[1]>
            >
          : MATRIX;

type Maze_MoveRight<MATRIX extends MazeMatrix> =
    Maze_FindSanta<MATRIX>[1] extends Maze_Decrement<MATRIX[0]["length"]>
        ? Maze_Escape<MATRIX>
        : Maze_Increment<Maze_FindSanta<MATRIX>[1]> extends number
          ? MATRIX[Maze_FindSanta<MATRIX>[0]][Maze_Increment<
                Maze_FindSanta<MATRIX>[1]
            >] extends Alley
              ? Maze_FillSanta<
                    Maze_RemoveSanta<MATRIX>,
                    Maze_FindSanta<MATRIX>[0],
                    Maze_Increment<Maze_FindSanta<MATRIX>[1]>
                >
              : MATRIX
          : never;

type Maze_MoveDown<MATRIX extends MazeMatrix> =
    Maze_FindSanta<MATRIX>[0] extends Maze_Decrement<MATRIX["length"]>
        ? Maze_Escape<MATRIX>
        : Maze_Increment<Maze_FindSanta<MATRIX>[0]> extends number
          ? MATRIX[Maze_Increment<
                Maze_FindSanta<MATRIX>[0]
            >][Maze_FindSanta<MATRIX>[1]] extends Alley
              ? Maze_FillSanta<
                    Maze_RemoveSanta<MATRIX>,
                    Maze_Increment<Maze_FindSanta<MATRIX>[0]>,
                    Maze_FindSanta<MATRIX>[1]
                >
              : MATRIX
          : never;

type Move<
    MATRIX extends MazeMatrix,
    DIRECTION extends Directions,
> = DIRECTION extends "up"
    ? Maze_MoveUp<MATRIX>
    : DIRECTION extends "left"
      ? Maze_MoveLeft<MATRIX>
      : DIRECTION extends "right"
        ? Maze_MoveRight<MATRIX>
        : DIRECTION extends "down"
          ? Maze_MoveDown<MATRIX>
          : MATRIX;
