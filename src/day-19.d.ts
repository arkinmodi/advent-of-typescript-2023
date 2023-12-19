type Toys = {
    "🛹": "🚲";
    "🚲": "🛴";
    "🛴": "🏄";
    "🏄": "🛹";
};

type ToyGen<T, U, V extends U[] = []> = V["length"] extends T
    ? V
    : ToyGen<T, U, [...V, U]>;

type Rebuild<T extends any[], U extends any[] = []> = T extends [
    infer F,
    ...infer R,
]
    ? U extends [...infer _, infer G extends keyof Toys]
        ? Rebuild<R, [...U, ...ToyGen<F, Toys[G]>]>
        : Rebuild<R, [...U, ...ToyGen<F, "🛹">]>
    : U;
